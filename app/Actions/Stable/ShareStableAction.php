<?php

namespace App\Actions\Stable;

use App\Enums\Stable\StableRole;
use App\Models\Stable;
use App\Models\User;
use Illuminate\Validation\ValidationException;

class ShareStableAction {
    public function search(Stable $stable, string $email, User $giver): array {
        $user = User::where('email', $email)->first();

        if (! $user) {
            return ['error' => 'Nincs ilyen felhasználó'];
        }

        if ($error = $this->isForbidden($stable, $user, $giver)) {
            return ['error' => $error];
        }

        return ['user' => ['name' => $user->name, 'email' => $user->email]];
    }

    public function execute(Stable $stable, User $user, StableRole $role, User $giver): void {
        if ($error = $this->isForbidden($stable, $user, $giver)) {
            throw ValidationException::withMessages(['email' => $error]);
        }

        $stable->users()->attach($user->id, [
            'stable_role' => $role->value,
            'giver_id' => $giver->id,
        ]);
    }

    protected function isForbidden(Stable $stable, User $user, User $giver): ?string {
        if ($user->is($giver) || $stable->owner_id === $user->id) {
            return 'Ez a saját istállód.';
        }

        if ($stable->users()->whereKey($user->id)->exists()) {
            return 'Már megosztva.';
        }

        return null;
    }
}
