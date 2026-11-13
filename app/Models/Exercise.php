<?php

namespace App\Models;

use App\Enums\Exercise\ExerciseCategory;
use App\Enums\Exercise\ExerciseIntensity;
use App\Enums\LogKind;

class Exercise extends Planned {
    protected $fillable = [
        'label',
        'category',
        'done',
        'duration_minutes',
        'intensity',
        'date',
        'time',
        'notes',
    ];

    protected function casts(): array {
        return array_merge(parent::casts(), [
            'category' => ExerciseCategory::class,
            'intensity' => ExerciseIntensity::class,
        ]);
    }

    public function kind(): LogKind {
        return LogKind::Exercise;
    }

    public function canComplete(): bool {
        return parent::canComplete() && ! $this->date->isFuture();
    }

    protected function logEntryDetail(): array {
        return [
            'category' => [
                'value' => $this->category->value,
                'label' => $this->category->label(),
                'icon' => $this->category->icon(),
            ],
            'duration_minutes' => $this->duration_minutes,
            'notes' => $this->notes,
        ];
    }
}
