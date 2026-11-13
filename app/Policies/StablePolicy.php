<?php

namespace App\Policies;

use App\Enums\Stable\StableAbility;
use App\Models\Stable;
use App\Models\User;

class StablePolicy {
    public function update(User $user, Stable $stable): bool {
        return $stable->owner_id === $user->id;
    }

    public function viewTodo(User $user, Stable $stable): bool {
        return $stable->allows($user, StableAbility::VIEW_TODO);
    }

    public function editTodo(User $user, Stable $stable): bool {
        return $stable->allows($user, StableAbility::EDIT_TODO);
    }

    public function manageShares(User $user, Stable $stable): bool {
        return $stable->owner_id === $user->id;
    }
}
