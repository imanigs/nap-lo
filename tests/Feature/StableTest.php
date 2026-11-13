<?php

use App\Models\User;

test("stable can't be shared twice with the same person", function () {
    $owner = User::factory()->create();
    $friend = User::factory()->create();
    $stable = $owner->ownStable();
    $stable->users()->attach($friend, ['stable_role' => 'viewer']);

    $this->actingAs($owner)->post(route('stables.shares.store', $stable), [
        'email' => $friend->email,
        'stable_role' => 'caretaker',
    ])->assertSessionHasErrors('email');
    expect($stable->users()->count())->toBe(1);
});

test('stable gets created upon registration', function () {
    $this->post(route('register'), [
        'first_name' => 'teszt',
        'last_name' => 'teszt',
        'email' => 'teszt@teszt.com',
        'password' => 'teszt123',
        'password_confirmation' => 'teszt123',
    ]);

    $user = User::where('email', 'teszt@teszt.com')->first();
    expect($user->stable)->not->toBeNull();
    expect($user->stable->name)->toBe('teszt istállója');
});
