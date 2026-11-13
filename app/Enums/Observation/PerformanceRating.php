<?php

namespace App\Enums\Observation;

enum PerformanceRating: int {
    case POOR = 1;
    case BELOW_AVERAGE = 2;
    case AVERAGE = 3;
    case GOOD = 4;
    case EXCELLENT = 5;

    public function label(): string {
        return match ($this) {
            self::POOR => 'Gyenge',
            self::BELOW_AVERAGE => 'Átlag alatti',
            self::AVERAGE => 'Átlagos',
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
