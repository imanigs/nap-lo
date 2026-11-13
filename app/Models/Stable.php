<?php

namespace App\Models;

use App\Enums\Horse\HorseRole;
use App\Enums\Stable\StableAbility;
use App\Enums\Stable\StableRole;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Stable extends Model {
    use HasFactory;

    protected $fillable = [
        'name',
    ];

    public function owner(): BelongsTo {
        return $this->belongsTo(User::class, 'owner_id');
    }

    public function users(): BelongsToMany {
        return $this->belongsToMany(User::class, 'stable_user')
            ->using(StableUser::class)
            ->withPivot(['stable_role', 'giver_id'])
            ->withTimestamps();
    }

    public function horses(): HasMany {
        return $this->hasMany(Horse::class)->orderBy('id');
    }

    public function todoLists(): HasMany {
        return $this->hasMany(TodoList::class);
    }

    public function allows(User $user, StableAbility $ability): bool {
        if ($this->owner_id === $user->id) {
            return true;
        }

        return $this->role($user)?->hasAbility($ability) ?? false;
    }

    public function horseAbilitiesFor(User $user): array {
        if ($this->owner_id === $user->id) {
            return HorseRole::FULL->abilities();
        }

        return $this->role($user)?->horseRole()->abilities() ?? [];
    }

    protected function role(User $user): ?StableRole {
        return $user->sharedStables->firstWhere('id', $this->id)?->pivot->stable_role;
    }
}
