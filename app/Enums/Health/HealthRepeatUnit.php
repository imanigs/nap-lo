<?php

namespace App\Enums\Health;

enum HealthRepeatUnit: string {
    case DAY = 'day';
    case WEEK = 'week';
    case MONTH = 'month';

    public function label(): string {
        return match ($this) {
            self::DAY => 'nap',
            self::WEEK => 'hét',
            self::MONTH => 'hónap',
        };
    }

    public static function options(): array {
        return array_map(fn (self $unit) => [
            'value' => $unit->value,
            'label' => $unit->label(),
        ], self::cases());
    }
}
