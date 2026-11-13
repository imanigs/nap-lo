<?php

namespace App\Models;

use App\Data\LogEntry;
use App\Enums\LogKind;
use App\Enums\Observation\BodyConditionScore;
use App\Enums\Observation\DispositionRating;
use App\Enums\Observation\HealthRating;
use App\Enums\Observation\PerformanceRating;
use App\Interfaces\HasLogEntries;
use Carbon\CarbonImmutable;
use Carbon\CarbonInterface;
use Illuminate\Support\Collection;

class Observation extends HorseLog implements HasLogEntries {
    protected $fillable = [
        'date',
        'height_cm',
        'weight_kg',
        'health_rating',
        'disposition_rating',
        'performance_rating',
        'bcs_rating',
        'notes',
    ];

    protected function casts(): array {
        return [
            'date' => 'date',
            'health_rating' => HealthRating::class,
            'disposition_rating' => DispositionRating::class,
            'performance_rating' => PerformanceRating::class,
            'bcs_rating' => BodyConditionScore::class,
        ];
    }

    public function kind(): LogKind {
        return LogKind::Observation;
    }

    public static function between(CarbonInterface $from, CarbonInterface $to, array $horseIds): Collection {
        return static::whereIn('horse_id', $horseIds)
            ->whereDate('date', '>=', $from->toDateString())
            ->whereDate('date', '<=', $to->toDateString())
            ->get();
    }

    public function logEntriesBetween(CarbonInterface $from, CarbonInterface $to): Collection {
        $day = $this->date->startOfDay();

        if (! $day->betweenIncluded(
            CarbonImmutable::instance($from)->startOfDay(),
            CarbonImmutable::instance($to)->endOfDay(),
        )) {
            return collect();
        }

        return collect([new LogEntry($this->kind(), $this->id, $this->horse, 'Megfigyelés', $day, null, null, [
                'weight_kg' => $this->weight_kg,
                'height_cm' => $this->height_cm,
                'notes' => $this->notes,
            ])]);
    }
}
