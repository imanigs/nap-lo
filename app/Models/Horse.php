<?php

namespace App\Models;

use App\Enums\Horse\Gender;
use App\Enums\Horse\HorseAbility;
use App\Observers\HorseObserver;
use Carbon\CarbonImmutable;
use Illuminate\Database\Eloquent\Attributes\ObservedBy;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Prunable;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\SoftDeletes;

#[ObservedBy([HorseObserver::class])]
class Horse extends Model {
    use HasFactory, Prunable, SoftDeletes;

    public const LOGS = [
        'feedRoutines',
        'exercises',
        'healthRecords',
        'observations',
        'measurement',
    ];

    protected $fillable = [
        'name',
        'gender',
        'birth_date',
        'status',
        'breed',
        'picture',
        'notes',
    ];

    public function scopeVisibleTo(Builder $query, User $user): void {
        $query->where(fn (Builder $query) => $query->where('owner_id', $user->id)
            ->orWhereIn('stable_id', $user->allStables()->modelKeys())
            ->orWhereHas('users', fn (Builder $query) => $query->whereKey($user->id)));
    }

    public function prunable(): Builder {
        return static::onlyTrashed()
            ->where('deleted_at', '<=', CarbonImmutable::now()->subDays(30));
    }

    protected function casts(): array {
        return [
            'gender' => Gender::class,
        ];
    }

    public function stable(): BelongsTo {
        return $this->belongsTo(Stable::class);
    }

    public function owner(): BelongsTo {
        return $this->belongsTo(User::class, 'owner_id');
    }

    public function feedRoutines(): HasMany {
        return $this->hasMany(FeedRoutine::class);
    }

    public function exercises(): HasMany {
        return $this->hasMany(Exercise::class);
    }

    public function healthRecords(): HasMany {
        return $this->hasMany(HealthRecord::class);
    }

    public function measurement(): HasOne {
        return $this->hasOne(Measurement::class);
    }

    public function observations(): HasMany {
        return $this->hasMany(Observation::class);
    }

    public function users(): BelongsToMany {
        return $this->belongsToMany(User::class, 'horse_user')
            ->using(HorseUser::class)
            ->withPivot(['horse_role', 'giver_id'])
            ->withTimestamps();
    }

    public function abilitiesFor(User $user): array {
        return array_map(
            fn (HorseAbility $ability) => $ability->value,
            $this->resolveAbilities($user),
        );
    }

    public function allows(User $user, HorseAbility $ability): bool {
        return in_array($ability, $this->resolveAbilities($user), true);
    }

    protected function resolveAbilities(User $user): array {
        if ($this->owner_id === $user->id) {
            return HorseAbility::cases();
        }

        $abilities = $this->stable->horseAbilitiesFor($user);

        $horseRole = $user->sharedHorses->firstWhere('id', $this->id)?->pivot->horse_role;

        if ($horseRole) {
            $abilities = array_merge($abilities, $horseRole->abilities());
        }

        return collect($abilities)->unique()->values()->all();
    }
}
