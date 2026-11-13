<?php

use App\Models\FeedRoutine;
use App\Models\Horse;

test('a feed routine can be added', function () {
    $horse = Horse::factory()->create();

    $this->actingAs($horse->owner)->post(route('horses.feed-routines.store', $horse), [
        'label' => 'teszt',
        'category' => 'grain',
        'quantity' => 2,
        'unit' => 'kg',
        'days_of_week' => [1, 2, 3],
        'times_of_day' => ['18:00', '07:00'],
        'starts_at' => now()->toDateString(),
    ]);

    expect(FeedRoutine::first()->label)->toBe('teszt');
    expect(FeedRoutine::first()->times_of_day)->toBe(['07:00', '18:00']);
});

test('a routine can be closed with a date', function () {
    $horse = Horse::factory()->create();
    $routine = $horse->feedRoutines()->create([
        'label' => 'teszt',
        'category' => 'grain',
        'starts_at' => today()->subMonth(),
    ]);

    $this->actingAs($horse->owner)
        ->post(route('horses.feed-routines.close', [$horse, $routine]), [
            'ends_at' => today()->subDay()->toDateString(),
        ])
        ->assertSessionHasNoErrors();

    expect(FeedRoutine::count())->toBe(1);
    expect($routine->fresh()->ends_at->toDateString())->toBe(today()->subDay()->toDateString());
});

test('a routine cant be closed before it started', function () {
    $horse = Horse::factory()->create();
    $routine = $horse->feedRoutines()->create([
        'label' => 'teszt',
        'category' => 'grain',
        'starts_at' => today(),
    ]);

    $this->actingAs($horse->owner)
        ->post(route('horses.feed-routines.close', [$horse, $routine]), [
            'ends_at' => today()->subDay()->toDateString(),
        ])
        ->assertSessionHasErrors('ends_at');

    expect($routine->fresh()->ends_at)->toBeNull();
});
