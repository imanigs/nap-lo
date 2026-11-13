<?php

namespace App\Enums\Observation;

enum DispositionRating: int {
    case EXTREMELY_QUIET = 1;
    case QUIET = 2;
    case AVERAGE = 3;
    case HOT = 4;
    case EXTREMELY_REACTIVE = 5;

    public function label(): string {
        return match ($this) {
            self::EXTREMELY_QUIET => 'Nagyon nyugodt',
            self::QUIET => 'Nyugodt',
            self::AVERAGE => 'Átlagos',
            self::HOT => 'Heves',
            self::EXTREMELY_REACTIVE => 'Nagyon reaktív',
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
