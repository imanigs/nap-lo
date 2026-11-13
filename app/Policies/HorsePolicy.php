<?php

namespace App\Policies;

use App\Enums\Horse\HorseAbility;
use App\Models\Horse;
use App\Models\User;

class HorsePolicy {
    public function viewAny(User $user): bool {
        return true;
    }

    public function view(User $user, Horse $horse): bool {
        return $horse->allows($user, HorseAbility::VIEW_PROFILE);
    }

    public function create(User $user): bool {
        return true;
    }

    public function update(User $user, Horse $horse): bool {
        return $horse->allows($user, HorseAbility::EDIT_PROFILE);
    }

    public function delete(User $user, Horse $horse): bool {
        return $horse->allows($user, HorseAbility::DELETE);
    }

    public function viewShares(User $user, Horse $horse): bool {
        return $horse->allows($user, HorseAbility::VIEW_SHARES);
    }

    public function manageShares(User $user, Horse $horse): bool {
        return $horse->allows($user, HorseAbility::MANAGE_SHARES);
    }
}
