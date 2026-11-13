<?php

namespace App\Enums;

use App\Enums\Horse\HorseAbility;
use App\Models\Exercise;
use App\Models\FeedRoutine;
use App\Models\HealthRecord;
use App\Models\Observation;

enum LogKind: string {
    case Feed = 'feed';
    case Exercise = 'exercise';
    case Health = 'health';
    case Observation = 'observation';

    public function model(): string {
        return match ($this) {
            self::Feed => FeedRoutine::class,
            self::Exercise => Exercise::class,
            self::Health => HealthRecord::class,
            self::Observation => Observation::class,
        };
    }

    public function viewAbility(): HorseAbility {
        return match ($this) {
            self::Feed => HorseAbility::VIEW_FEED,
            self::Exercise => HorseAbility::VIEW_EXERCISE,
            self::Health => HorseAbility::VIEW_HEALTH,
            self::Observation => HorseAbility::VIEW_OBSERVATION,
        };
    }

    public function editAbility(): HorseAbility {
        return match ($this) {
            self::Feed => HorseAbility::EDIT_FEED,
            self::Exercise => HorseAbility::EDIT_EXERCISE,
            self::Health => HorseAbility::EDIT_HEALTH,
            self::Observation => HorseAbility::EDIT_OBSERVATION,
        };
    }

    public function label(): string {
        return match ($this) {
            self::Feed => 'Etetés',
            self::Exercise => 'Edzés',
            self::Health => 'Egészség',
            self::Observation => 'Megfigyelés',
        };
    }
}
