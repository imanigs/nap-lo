<?php

namespace App\Enums\Observation;

enum HealthRating: int {
    case CRITICAL = 1;
    case POOR = 2;
    case MODERATE = 3;
    case GOOD = 4;
    case EXCELLENT = 5;

    public function label(): string {
        return match ($this) {
            self::CRITICAL => 'Kritikus',
            self::POOR => 'Rossz',
            self::MODERATE => 'Közepes',
            self::GOOD => 'Jó',
            self::EXCELLENT => 'Kiváló',
        };
    }

    public function option(): array {
        return [
            'value' => $this->value,
            'label' => $this->label(),
        ];
    }

    public static function options(): array {
        return array_map(fn (self $rating) => $rating->option(), self::cases());
    }
}
