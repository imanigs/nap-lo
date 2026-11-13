<?php

use App\Enums\LogKind;
use App\Models\Horse;
use App\Models\User;
use App\Services\LogEntryService;

test('a feed routine is expanded for the correct dates', function () {
    $horse = Horse::factory()->create();
    $horse->feedRoutines()->create([
        'label' => 'teszt',
        'category' => 'grain',
        'days_of_week' => [1, 2, 3, 4, 5, 6, 7],
        'times_of_day' => ['07:00'],
        'starts_at' => today()->subWeek(),
    ]);

    $logEntries = (new LogEntryService)->between(
        $horse->owner,
        today(),
        today()->addDay()->endOfDay(),
        [LogKind::Feed],
    );

    expect($logEntries)->toHaveCount(2);
    expect($logEntries->first()->date->format('H:i'))->toBe('07:00');
});

test('a viewer sees horse that got shared with him', function () {
    $horse = Horse::factory()->create();
    $viewer = User::factory()->create();
    $horse->users()->attach($viewer, ['horse_role' => 'viewer']);
    $horse->exercises()->create([
        'label' => 'teszt',
        'category' => 'ridden',
        'date' => today(),
    ]);

    expect((new LogEntryService)->between($viewer, today(), today()->endOfDay()))->toHaveCount(1);
});

test('overdue returns pending exercises and health records', function () {
    $horse = Horse::factory()->create();
    $horse->healthRecords()->create([
        'label' => 'teszt1',
        'category' => 'farrier',
        'date' => today()->subDays(3),
    ]);
    $horse->healthRecords()->create([
        'label' => 'teszt2',
        'category' => 'farrier',
        'date' => today()->subDays(3),
        'done' => true,
    ]);
    $horse->exercises()->create([
        'label' => 'teszt3',
        'category' => 'ridden',
        'date' => today()->subDays(3),
    ]);

    $overdue = (new LogEntryService)->overdue($horse->owner, today());

    expect($overdue->pluck('title')->sort()->values()->all())->toBe(['teszt1', 'teszt3']);
});
