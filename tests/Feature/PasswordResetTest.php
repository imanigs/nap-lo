<?php

use App\Models\User;
use Illuminate\Auth\Events\PasswordReset;
use Illuminate\Support\Facades\Event;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Password;

test('password can be reset with valid link', function () {
    Event::fake([PasswordReset::class]);

    $user = User::factory()->create();

    $token = Password::createToken($user);

    $this->post(route('password.update'), [
        'token' => $token,
        'email' => $user->email,
        'password' => 'teszt123',
        'password_confirmation' => 'teszt123',
    ])
        ->assertSessionHasNoErrors()
        ->assertRedirect(route('login'))
        ->assertInertiaFlash('status');

    expect(Hash::check('teszt123', $user->fresh()->password))->toBeTrue();

    Event::assertDispatched(PasswordReset::class);
});

test('password cant be reset with invalid link', function () {
    $user = User::factory()->create();
    $originalPassword = $user->password;

    $this->post(route('password.update'), [
        'token' => 'teszt',
        'email' => $user->email,
        'password' => 'teszt123',
        'password_confirmation' => 'teszt123',
    ])->assertSessionHasErrors('email');

    expect($user->fresh()->password)->toBe($originalPassword);
});
