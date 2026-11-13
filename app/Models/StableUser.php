<?php

namespace App\Models;

use App\Enums\Stable\StableRole;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\Pivot;

class StableUser extends Pivot {
    protected $table = 'stable_user';

    protected $fillable = [
        'stable_id',
        'user_id',
        'stable_role',
        'giver_id',
    ];

    protected function casts(): array {
        return [
            'stable_role' => StableRole::class,
        ];
    }

    public function user(): BelongsTo {
        return $this->belongsTo(User::class);
    }

    public function stable(): BelongsTo {
        return $this->belongsTo(Stable::class);
    }
}
