<?php

namespace App\Enums\Exercise;

enum ExerciseIntensity: string {
    case LOW = 'low';
    case MEDIUM = 'medium';
    case HIGH = 'high';
    case EXTREME = 'extreme';

    public function label(): string {
        return match ($this) {
            self::LOW => 'Alacsony',
            self::MEDIUM => 'Közepes',
            self::HIGH => 'Magas',
            self::EXTREME => 'Extrém',
        };
    }

    public static function options(): array {
        return array_map(fn (self $intensity) => [
            'value' => $intensity->value,
            'label' => $intensity->label(),
        ], self::cases());
    }
}
