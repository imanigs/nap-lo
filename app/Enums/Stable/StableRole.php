<?php

namespace App\Enums\Stable;

use App\Enums\Horse\HorseRole;

enum StableRole: string {
    case FULL = 'full';
    case CARETAKER = 'caretaker';
    case VIEWER = 'viewer';

    public function abilities(): array {
        return match ($this) {
            self::FULL => [StableAbility::VIEW_TODO, StableAbility::EDIT_TODO],
            self::CARETAKER => [StableAbility::VIEW_TODO],
            self::VIEWER => [],
        };
    }

    public function horseRole(): HorseRole {
        return match ($this) {
            self::FULL => HorseRole::FULL,
            self::CARETAKER => HorseRole::CARETAKER,
            self::VIEWER => HorseRole::VIEWER,
        };
    }

    public function hasAbility(StableAbility $ability): bool {
        return in_array($ability, $this->abilities(), true);
    }

    public function label(): string {
        return match ($this) {
            self::FULL => 'teljes',
            self::CARETAKER => 'gondozó',
            self::VIEWER => 'megtekintő',
        };
    }
}
