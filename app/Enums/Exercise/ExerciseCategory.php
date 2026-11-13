<?php

namespace App\Enums\Exercise;

use App\Enums\Traits\HasIcon;

enum ExerciseCategory: string {
    use HasIcon;

    case RIDDEN = 'ridden';
    case LUNGING = 'lunging';
    case GROUNDWORK = 'groundwork';
    case TRAIL = 'trail';
    case DRIVING = 'driving';

    public function label(): string {
        return match ($this) {
            self::RIDDEN => 'Lovaglás',
            self::LUNGING => 'Futószár',
            self::GROUNDWORK => 'Földi munka',
            self::TRAIL => 'Terep',
            self::DRIVING => 'Fogathajtás',
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
