<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\RegistrationRequest;
use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class RegistrationController extends Controller {
    public function show() {
        return Inertia::render('auth/register');
    }

    public function register(RegistrationRequest $request) {
        $user = DB::transaction(function () use ($request) {
            $user = User::create($request->validated());

            $user->ownStable();

            return $user;
        });

        event(new Registered($user));
        Auth::login($user);

        return redirect()->intended('dashboard');
    }
}
