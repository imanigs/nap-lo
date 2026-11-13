<?php

namespace App\Enums\Horse;

enum HorseRole: string {
    case FULL = 'full';
    case CARETAKER = 'caretaker';
    case VIEWER = 'viewer';

    public function abilities(): array {
        return match ($this) {
            self::FULL => array_values(array_filter(
                HorseAbility::cases(),
                fn (HorseAbility $ability) => $ability !== HorseAbility::DELETE
            )),
            self::CARETAKER => [
                HorseAbility::VIEW_PROFILE,
                HorseAbility::VIEW_FEED,
                HorseAbility::EDIT_FEED,
                HorseAbility::VIEW_EXERCISE,
                HorseAbility::EDIT_EXERCISE,
                HorseAbility::VIEW_HEALTH,
                HorseAbility::EDIT_HEALTH,
                HorseAbility::VIEW_OBSERVATION,
                HorseAbility::EDIT_OBSERVATION,
            ],
            self::VIEWER => [
                HorseAbility::VIEW_PROFILE,
                HorseAbility::VIEW_FEED,
                HorseAbility::VIEW_EXERCISE,
                HorseAbility::VIEW_HEALTH,
                HorseAbility::VIEW_OBSERVATION,
            ],
        };
    }

    public function label(): string {
        return match ($this) {
            self::FULL => 'teljes',
            self::CARETAKER => 'gondozó',
            self::VIEWER => 'megtekintő',
        };
    }
}
