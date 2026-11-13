<?php

namespace App\Policies;

use App\Enums\LogKind;

class ExercisePolicy extends HorseLogPolicy {
    protected function kind(): LogKind {
        return LogKind::Exercise;
    }
}
