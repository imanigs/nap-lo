<?php

namespace App\Policies;

use App\Enums\LogKind;
use App\Models\Horse;
use App\Models\HorseLog;
use App\Models\User;

abstract class HorseLogPolicy {
    abstract protected function kind(): LogKind;

    public function create(User $user, Horse $horse): bool {
        return $horse->allows($user, $this->kind()->editAbility());
    }

    public function update(User $user, HorseLog $log): bool {
        return $log->horse->allows($user, $this->kind()->editAbility());
    }

    public function delete(User $user, HorseLog $log): bool {
        return $log->horse->allows($user, $this->kind()->editAbility());
    }
}
