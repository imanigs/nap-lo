<?php

namespace App\Actions\Horse;

use App\Enums\Horse\HorseRole;
use App\Models\Horse;
use App\Models\User;
use Illuminate\Validation\ValidationException;

class ShareHorseAction {
    public function search(Horse $horse, string $email, User $giver): array {
        $user = User::where('email', $email)->first();

        if (! $user) {
            return ['error' => 'Nincs ilyen felhasználó'];
        }

        if ($error = $this->isForbidden($horse, $user, $giver)) {
            return ['error' => $error];
        }

        return ['user' => ['name' => $user->name, 'email' => $user->email]];
    }

    public function execute(Horse $horse, User $user, HorseRole $role, User $giver): void {
        if ($error = $this->isForbidden($horse, $user, $giver)) {
            throw ValidationException::withMessages(['email' => $error]);
        }

        $horse->users()->attach($user->id, [
            'horse_role' => $role->value,
            'giver_id' => $giver->id,
        ]);
    }

    protected function isForbidden(Horse $horse, User $user, User $giver): ?string {
        if ($user->is($giver)) {
            return 'Magaddal nem oszthatod meg a lovat.';
        }

        if ($horse->owner_id === $user->id) {
            return 'A ló tulajdonosával nem lehet megosztani.';
        }

        if ($horse->stable->owner_id === $user->id) {
            return 'Az istálló tulajdonosa már hozzáfér a lóhoz.';
        }

        if ($horse->users()->whereKey($user->id)->exists()) {
            return 'Már megosztva ezzel a felhasználóval.';
        }

        return null;
    }
}
