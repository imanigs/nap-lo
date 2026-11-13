<?php

namespace App\Http\Controllers;

use App\Actions\Stable\ShareStableAction;
use App\Enums\Stable\StableRole;
use App\Http\Requests\Stable\StoreStableShareRequest;
use App\Http\Resources\StableResource;
use App\Models\Stable;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class StableShareController extends Controller {
    public function index(Request $request, Stable $stable, ShareStableAction $shareStable) {
        $shares = $stable->users->map(fn (User $sharedUser) => [
            'id' => $sharedUser->id,
            'name' => $sharedUser->name,
            'email' => $sharedUser->email,
            'role' => $sharedUser->pivot->stable_role->value,
        ]);

        $search = null;

        if ($request->filled('share_email')) {
            $email = $request->query('share_email');
            $search = $shareStable->search($stable, $email, $request->user());
        }

        return Inertia::render('stables/shares', [
            'stable' => StableResource::make($stable),
            'shares' => $shares,
            'search' => $search,
        ]);
    }

    public function store(StoreStableShareRequest $request, Stable $stable, ShareStableAction $shareStable) {
        $sharedUser = User::where('email', $request->validated('email'))->firstOrFail();
        $role = StableRole::from($request->validated('stable_role'));

        $shareStable->execute($stable, $sharedUser, $role, $request->user());

        Inertia::flash('status', 'Az istálló megosztva!');

        return redirect()->route('stables.shares.index', $stable->id);
    }

    public function update(Request $request, Stable $stable, User $user) {
        $validated = $request->validate([
            'stable_role' => ['required', Rule::enum(StableRole::class)],
        ]);

        if (! $stable->users()->whereKey($user->id)->exists()) {
            abort(404);
        }

        $role = $validated['stable_role'];
        $stable->users()->updateExistingPivot($user->id, ['stable_role' => $role]);

        return Inertia::flash('status', 'Szerepkör módosítva!')->back();
    }

    public function destroy(Stable $stable, User $user) {
        $stable->users()->detach($user->id);
        $user->deleteNotificationsFor($stable->horses()->pluck('id')->all());

        return Inertia::flash('status', 'A megosztás megszűnt!')->back();
    }
}
