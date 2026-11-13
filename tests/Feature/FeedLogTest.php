<?php

use App\Models\FeedLog;
use App\Models\Horse;

test('old feed logs get deleted', function () {
    $horse = Horse::factory()->create();
    $routine = $horse->feedRoutines()->create([
        'label' => 'teszt',
        'category' => 'grain',
        'starts_at' => today()->subWeek(),
    ]);
    $routine->feedLogs()->create([
        'date' => today()->subDays(40),
        'time' => '07:00',
    ]);
    $routine->feedLogs()->create([
        'date' => today()->subDays(2),
        'time' => '07:00',
    ]);

    $this->artisan('model:prune');

    expect(FeedLog::count())->toBe(1);
});
