<?php

namespace App\Http\Controllers;

use App\Models\Horse;
use App\Models\Stable;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ShareSettingsController extends Controller {
    public function index(Request $request) {
        $user = $request->user();
        $stable = $user->ownStable()->load('users');

        return Inertia::render('auth/shares', [
            'sharedWithUser' => [
                'horses' => $user->sharedHorses()->with('owner')->orderBy('name')->get()
                    ->map(fn (Horse $horse) => [
                        'id' => $horse->id,
                        'name' => $horse->name,
                        'owner' => $horse->owner->name,
                        'role' => $horse->pivot->horse_role->value,
                    ]),
                'stables' => $user->sharedStables()->with('owner')->orderBy('name')->get()
                    ->map(fn (Stable $stable) => [
                        'id' => $stable->id,
                        'name' => $stable->name,
                        'owner' => $stable->owner->name,
                        'role' => $stable->pivot->stable_role->value,
                    ]),
            ],
            'sharedByUser' => [
                'horses' => $user->horses()->whereHas('users')->with('users')->orderBy('name')
                    ->get()
                    ->map(fn (Horse $horse) => [
                        'id' => $horse->id,
                        'name' => $horse->name,
                        'shares' => $horse->users->map(fn (User $shared) => [
                            'id' => $shared->id,
                            'name' => $shared->name,
                            'email' => $shared->email,
                            'role' => $shared->pivot->horse_role->value,
                        ]),
                    ]),
                'stable' => [
                    'id' => $stable->id,
                    'name' => $stable->name,
                    'shares' => $stable->users->map(fn (User $shared) => [
                        'id' => $shared->id,
                        'name' => $shared->name,
                        'email' => $shared->email,
                        'role' => $shared->pivot->stable_role->value,
                    ]),
                ],
            ],
        ]);
    }

    public function leaveHorse(Request $request, Horse $horse) {
        $request->user()->sharedHorses()->detach($horse->id);
        $request->user()->deleteNotificationsFor([$horse->id]);

        return Inertia::flash('status', 'Sikeresen kiléptél a ló megosztásából.')->back();
    }

    public function leaveStable(Request $request, Stable $stable) {
        $request->user()->sharedStables()->detach($stable->id);
        $request->user()->deleteNotificationsFor($stable->horses()->pluck('id')->all());

        return Inertia::flash('status', 'Sikeresen kiléptél az istálló megosztásából.')->back();
    }
}
