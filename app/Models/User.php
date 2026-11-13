<?php

namespace App\Models;

use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Collection as EloquentCollection;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable implements MustVerifyEmail {
    use HasFactory, Notifiable;

    protected $fillable = [
        'first_name',
        'last_name',
        'email',
        'email_notifications',
        'password',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected function casts(): array {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'email_notifications' => 'boolean',
        ];
    }

    protected function name(): Attribute {
        return Attribute::make(
            get: fn () => "{$this->last_name} {$this->first_name}"
        );
    }

    public function stable(): HasOne {
        return $this->hasOne(Stable::class, 'owner_id');
    }

    public function ownStable(): Stable {
        return $this->stable()->firstOrCreate([], ['name' => $this->first_name.' istállója']);
    }

    public function allStables(): EloquentCollection {
        return (new EloquentCollection([$this->ownStable()]))->merge($this->sharedStables);
    }

    public function allHorses(): EloquentCollection {
        return Horse::visibleTo($this)->with('stable')->orderBy('id')->get();
    }

    public function sharedStables(): BelongsToMany {
        return $this->belongsToMany(Stable::class, 'stable_user')
            ->using(StableUser::class)
            ->withPivot(['stable_role', 'giver_id'])
            ->withTimestamps();
    }

    public function reminders(): HasMany {
        return $this->hasMany(Reminder::class);
    }

    public function deleteNotificationsFor(array $horseIds): void {
        $lostHorseIds = array_diff($horseIds, Horse::visibleTo($this->fresh())->pluck('id')->all());

        $this->notifications()->whereIn('data->horse_id', $lostHorseIds)->delete();
    }

    public function horses(): HasMany {
        return $this->hasMany(Horse::class, 'owner_id');
    }

    public function sharedHorses(): BelongsToMany {
        return $this->belongsToMany(Horse::class, 'horse_user')
            ->using(HorseUser::class)
            ->withPivot(['horse_role', 'giver_id'])
            ->withTimestamps();
    }
}
