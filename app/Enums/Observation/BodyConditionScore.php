<?php

namespace App\Enums\Observation;

enum BodyConditionScore: int {
    case VERY_POOR = 0;
    case POOR = 1;
    case MODERATE = 2;
    case GOOD = 3;
    case FAT = 4;
    case VERY_FAT = 5;

    public function label(): string {
        return match ($this) {
            self::VERY_POOR => 'Nagyon sovány',
            self::POOR => 'Sovány',
            self::MODERATE => 'Közepes',
            self::GOOD => 'Jó',
            self::FAT => 'Kövér',
            self::VERY_FAT => 'Nagyon kövér',
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
