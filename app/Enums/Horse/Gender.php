<?php

namespace App\Enums\Horse;

enum Gender: string {
    case MARE = 'mare';
    case STALLION = 'stallion';
    case GELDING = 'gelding';

    public function label(): string {
        return match ($this) {
            self::MARE => 'Kanca',
            self::STALLION => 'Mén',
            self::GELDING => 'Herélt',
        };
    }

    public static function options(): array {
        return array_map(fn (self $gender) => [
            'value' => $gender->value,
            'label' => $gender->label(),
        ], self::cases());
    }
}
