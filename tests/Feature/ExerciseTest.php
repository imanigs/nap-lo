<?php

use App\Models\Horse;

test("a finished exercise can't be in the future", function () {
    $horse = Horse::factory()->create();

    $this->actingAs($horse->owner)->post(route('horses.exercises.store', $horse), [
        'label' => 'teszt',
        'category' => 'ridden',
        'done' => true,
        'date' => now()->addDay()->toDateString(),
    ])->assertSessionHasErrors('date');
});

test('todays exercise can be done', function () {
    $horse = Horse::factory()->create();
    $exercise = $horse->exercises()->create([
        'label' => 'teszt',
        'category' => 'ridden',
        'date' => today(),
    ]);

    $this->actingAs($horse->owner)->post(route('horses.exercises.complete', [$horse, $exercise]), [
        'duration_minutes' => 45,
    ]);

    expect($exercise->fresh()->done)->toBeTrue();
    expect($exercise->fresh()->duration_minutes)->toBe(45);
});

test("a future exercise can't get done", function () {
    $horse = Horse::factory()->create();
    $exercise = $horse->exercises()->create([
        'label' => 'teszt',
        'category' => 'ridden',
        'date' => today()->addDays(3),
    ]);

    $this->actingAs($horse->owner)
        ->post(route('horses.exercises.complete', [$horse, $exercise]), [])
        ->assertSessionHasErrors('done');
    expect($exercise->fresh()->done)->toBeFalse();
});
