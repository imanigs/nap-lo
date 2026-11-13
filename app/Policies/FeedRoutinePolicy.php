<?php

namespace App\Policies;

use App\Enums\LogKind;

class FeedRoutinePolicy extends HorseLogPolicy {
    protected function kind(): LogKind {
        return LogKind::Feed;
    }
}
