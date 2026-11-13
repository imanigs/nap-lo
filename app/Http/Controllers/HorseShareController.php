<?php

namespace App\Http\Controllers;

use App\Actions\Horse\ShareHorseAction;
use App\Enums\Horse\HorseAbility;
use App\Enums\Horse\HorseRole;
use App\Http\Requests\Horse\StoreHorseShareRequest;
use App\Http\Resources\HorseResource;
use App\Models\Horse;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class HorseShareController extends Controller {
    public function index(Request $request, Horse $horse, ShareHorseAction $shareHorse) {
        $user = $request->user();

        $shares = $horse->users->map(fn (User $sharedUser) => [
            'id' => $sharedUser->id,
            'name' => $sharedUser->name,
            'email' => $sharedUser->email,
            'role' => $sharedUser->pivot->horse_role->value,
        ]);

        $search = null;

        if ($request->filled('share_email') && $horse->allows($user, HorseAbility::MANAGE_SHARES)) {
            $search = $shareHorse->search($horse, $request->query('share_email'), $user);
        }

        return Inertia::render('horses/shares', [
            'horse' => HorseResource::make($horse),
            'abilities' => $horse->abilitiesFor($user),
            'shares' => $shares,
            'search' => $search,
        ]);
    }

    public function store(StoreHorseShareRequest $request, Horse $horse, ShareHorseAction $shareHorse) {
        $sharedUser = User::where('email', $request->validated('email'))->firstOrFail();
        $role = HorseRole::from($request->validated('horse_role'));

        $shareHorse->execute($horse, $sharedUser, $role, $request->user());

        Inertia::flash('status', 'Ló sikeresen megosztva!');

        return redirect()->route('horses.shares.index', $horse->id);
    }

    public function update(Request $request, Horse $horse, User $user) {
        $validated = $request->validate([
            'horse_role' => ['required', Rule::enum(HorseRole::class)],
        ]);

        if (! $horse->users()->whereKey($user->id)->exists()) {
            abort(404);
        }

        $horse->users()->updateExistingPivot($user->id, ['horse_role' => $validated['horse_role']]);

        return Inertia::flash('status', 'Szerepkör módosítva!')->back();
    }

    public function destroy(Horse $horse, User $user) {
        $horse->users()->detach($user->id);
        $user->deleteNotificationsFor([$horse->id]);

        return Inertia::flash('status', 'A megosztás megszűnt!')->back();
    }
}
