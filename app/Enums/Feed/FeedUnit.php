<?php

namespace App\Enums\Feed;

enum FeedUnit: string {
    case GRAM = 'g';
    case KILOGRAM = 'kg';
    case MILLILITER = 'ml';
    case LITER = 'l';
    case SCOOP = 'scoop';
    case FLAKE = 'flake';
    case BALE = 'bale';
    case HANDFUL = 'handful';
    case FORK = 'fork';
    case PIECE = 'piece';
    case BLOCK = 'block';
    case HOUR = 'hour';

    public function label(): string {
        return match ($this) {
            self::GRAM => 'g',
            self::KILOGRAM => 'kg',
            self::MILLILITER => 'ml',
            self::LITER => 'l',
            self::SCOOP => 'merőkanál',
            self::FLAKE => 'szelet',
            self::BALE => 'bála',
            self::HANDFUL => 'marék',
            self::FORK => 'villa',
            self::PIECE => 'db',
            self::BLOCK => 'tömb',
            self::HOUR => 'óra',
        };
    }

    public static function options(): array {
        return array_map(fn (self $unit) => [
            'value' => $unit->value,
            'label' => $unit->label(),
        ], self::cases());
    }
}
