<?php

namespace App\Models;

use App\Enums\Horse\HorseRole;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\Pivot;

class HorseUser extends Pivot {
    protected $table = 'horse_user';

    protected $fillable = [
        'horse_id',
        'user_id',
        'horse_role',
        'giver_id',
    ];

    protected function casts(): array {
        return [
            'horse_role' => HorseRole::class,
        ];
    }

    public function horse(): BelongsTo {
        return $this->belongsTo(Horse::class);
    }

    public function user(): BelongsTo {
        return $this->belongsTo(User::class);
    }

    public function giver(): BelongsTo {
        return $this->belongsTo(User::class, 'giver_id');
    }
}
