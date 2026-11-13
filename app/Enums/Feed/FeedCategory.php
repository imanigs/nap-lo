<?php

namespace App\Enums\Feed;

use App\Enums\Traits\HasIcon;

enum FeedCategory: string {
    use HasIcon;

    case ROUGHAGE = 'roughage';
    case GRASS = 'grass';
    case FORAGE = 'forage';
    case GRAIN = 'grain';
    case TREAT = 'treat';
    case SUPPLEMENT = 'supplement';

    public function label(): string {
        return match ($this) {
            self::ROUGHAGE => 'Szálas takarmány',
            self::GRASS => 'Friss fű',
            self::FORAGE => 'Legelés',
            self::GRAIN => 'Abrak',
            self::TREAT => 'Jutalomfalat',
            self::SUPPLEMENT => 'Kiegészítő',
        };
    }

    public static function options(): array {
        return array_map(fn (self $category) => [
            'value' => $category->value,
            'label' => $category->label(),
            'icon' => $category->icon(),
        ], self::cases());
    }
}
