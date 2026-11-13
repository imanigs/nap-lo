<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Password;
use Inertia\Inertia;

class PasswordResetLinkController extends Controller {
    public function create() {
        return Inertia::render('auth/forgot-password');
    }

    public function store(Request $request) {
        Password::sendResetLink($request->validate(['email' => ['required', 'email', 'max:255']]));

        return Inertia::flash(
            'status',
            'Ha az email cím szerepel a rendszerünkben, elküldtük a jelszó-visszaállító linket.'
        )->back();
    }
}
