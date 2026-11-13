<?php

namespace App\Enums\Health;

use App\Enums\Traits\HasIcon;

enum HealthCategory: string {
    use HasIcon;

    case VACCINATION = 'vaccination';
    case DEWORMING = 'deworming';
    case FARRIER = 'farrier';
    case VET = 'vet';
    case ILLNESS = 'illness';
    case INJURY = 'injury';
    case OTHER = 'other';

    public function label(): string {
        return match ($this) {
            self::VACCINATION => 'Oltás',
            self::DEWORMING => 'Féreghajtás',
            self::FARRIER => 'Kovács',
            self::VET => 'Állatorvos',
            self::ILLNESS => 'Betegség',
            self::INJURY => 'Sérülés',
            self::OTHER => 'Egyéb',
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
