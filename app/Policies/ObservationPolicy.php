<?php

namespace App\Policies;

use App\Enums\LogKind;

class ObservationPolicy extends HorseLogPolicy {
    protected function kind(): LogKind {
        return LogKind::Observation;
    }
}
