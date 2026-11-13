<?php

use App\Models\Horse;
use App\Models\User;

test('overdue and today are listed, the future is not', function () {
    $horse = Horse::factory()->create();
    $horse->exercises()->create([
        'label' => 'teszt',
        'category' => 'ridden',
        'date' => today()->subDay(),
    ]);
    $horse->exercises()->create([
        'label' => 'teszt',
        'category' => 'ridden',
        'date' => today(),
    ]);
    $horse->exercises()->create([
        'label' => 'teszt',
        'category' => 'ridden',
        'date' => today()->addDay(),
    ]);

    $this->actingAs($horse->owner)->get(route('dashboard'))
        ->assertInertia(fn ($page) => $page->has('items', 2));
});

test('only open to-dos are listed', function () {
    $horse = Horse::factory()->create();
    $list = $horse->stable->todoLists()->create(['title' => 'teszt']);
    $list->items()->create(['title' => 'teszt']);
    $list->items()->create([
        'title' => 'teszt',
        'is_completed' => true,
    ]);

    $this->actingAs($horse->owner)->get(route('dashboard'))
        ->assertInertia(fn ($page) => $page->has('todos.0.items', 1));
});

test('stable viewer sees the horses but not the to-dos', function () {
    $horse = Horse::factory()->create();
    $horse->exercises()->create([
        'label' => 'teszt',
        'category' => 'ridden',
        'date' => today(),
    ]);
    $horse->stable->todoLists()->create(['title' => 'teszt'])
        ->items()->create(['title' => 'teszt']);
    $viewer = User::factory()->create();
    $horse->stable->users()->attach($viewer, ['stable_role' => 'viewer']);

    $this->actingAs($viewer)->get(route('dashboard'))
        ->assertInertia(fn ($page) => $page->has('items', 1)->has('todos', 0));
});

test('horse logs from all the stables are shown', function () {
    $user = User::factory()->create();
    $own = Horse::factory()->ownedBy($user)->create();
    $other = Horse::factory()->create();
    $other->stable->users()->attach($user, ['stable_role' => 'caretaker']);
    $own->exercises()->create([
        'label' => 'teszt',
        'category' => 'ridden',
        'date' => today(),
    ]);
    $other->exercises()->create([
        'label' => 'teszt',
        'category' => 'ridden',
        'date' => today(),
    ]);

    $this->actingAs($user)->get(route('dashboard'))
        ->assertInertia(fn ($page) => $page->has('items', 2));
});
