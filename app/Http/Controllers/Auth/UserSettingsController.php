<?php

namespace App\Http\Controllers\Auth;

use App\Actions\User\DeleteAccountAction;
use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\UpdatePasswordRequest;
use App\Http\Requests\Auth\UpdateUserSettingsRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class UserSettingsController extends Controller {
    public function edit() {
        return Inertia::render('auth/settings');
    }

    public function update(UpdateUserSettingsRequest $request) {
        $validated = $request->validated();

        $request->user()->fill($validated);

        if ($request->user()->isDirty('email')) {
            $request->user()->email_verified_at = null;
        }

        $request->user()->save();

        if ($request->user()->wasChanged('email')) {
            $request->user()->sendEmailVerificationNotification();
        }

        return Inertia::flash('status', 'Sikeres módosítás.')->back();
    }

    public function updatePassword(UpdatePasswordRequest $request) {
        $user = $request->user();
        $user->update(['password' => $request->validated('password')]);
        DB::table('sessions')->where('user_id', $user->id)->delete();

        Auth::logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        Inertia::flash('status', 'Sikeres jelszó változtatás. Jelentkezz be újra.');

        return redirect()->route('login');
    }

    public function destroy(Request $request, DeleteAccountAction $deleteAccount) {
        $request->validate(['password' => ['required', 'current_password']]);

        $deleteAccount->execute($request->user());

        Auth::forgetUser();
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        Inertia::flash('status', 'Fiók törölve.');

        return redirect()->route('home');
    }
}
