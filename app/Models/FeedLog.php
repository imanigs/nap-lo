<?php

namespace App\Models;

use Carbon\CarbonImmutable;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\MassPrunable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class FeedLog extends Model {
    use MassPrunable;

    protected $fillable = [
        'date',
        'time',
    ];

    protected function casts(): array {
        return [
            'date' => 'date',
        ];
    }

    public function prunable(): Builder {
        return static::whereDate('date', '<', CarbonImmutable::now()->subDays(30)->toDateString());
    }

    public function feedRoutine(): BelongsTo {
        return $this->belongsTo(FeedRoutine::class);
    }
}
