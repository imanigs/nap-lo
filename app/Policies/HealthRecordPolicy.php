<?php

namespace App\Policies;

use App\Enums\LogKind;

class HealthRecordPolicy extends HorseLogPolicy {
    protected function kind(): LogKind {
        return LogKind::Health;
    }
}
