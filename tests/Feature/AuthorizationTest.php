<?php

use App\Models\Horse;
use App\Models\User;

test('a stranger cannot see a horse', function () {
    $horse = Horse::factory()->create();
    $this->actingAs(User::factory()->create());

    $this->get(route('horses.show', $horse))->assertForbidden();
    $this->get(route('horses.edit', $horse))->assertForbidden();
    $this->delete(route('horses.destroy', $horse))->assertForbidden();
    $this->post(route('horses.exercises.store', $horse))->assertForbidden();
});

test('a viewer can look at a horse but cannot change it', function () {
    $horse = Horse::factory()->create();
    $viewer = User::factory()->create();
    $horse->users()->attach($viewer, ['horse_role' => 'viewer']);

    $this->actingAs($viewer);
    $this->get(route('horses.show', $horse))->assertOk();
    $this->get(route('horses.edit', $horse))->assertForbidden();
    $this->delete(route('horses.destroy', $horse))->assertForbidden();
    $this->post(route('horses.exercises.store', $horse))->assertForbidden();
    $this->post(route('horses.health-records.store', $horse))->assertForbidden();
    $this->post(route('horses.feed-routines.store', $horse))->assertForbidden();
});
