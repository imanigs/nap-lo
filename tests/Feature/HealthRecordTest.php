<?php

use App\Models\HealthRecord;
use App\Models\Horse;

test("a done record can't be in the future", function () {
    $horse = Horse::factory()->create();

    $this->actingAs($horse->owner)->post(route('horses.health-records.store', $horse), [
        'label' => 'teszt',
        'category' => 'farrier',
        'done' => true,
        'date' => now()->addWeek()->toDateString(),
    ])->assertSessionHasErrors('date');
});

test('completing a repeating record creates the next one', function () {
    $horse = Horse::factory()->create();
    $record = $horse->healthRecords()->create([
        'label' => 'teszt',
        'category' => 'farrier',
        'date' => today(),
        'repeat_every' => 2,
        'repeat_unit' => 'month',
    ]);

    $this->actingAs($horse->owner)
        ->post(route('horses.health-records.complete', [$horse, $record]), [
            'date' => now()->toDateString(),
        ]);

    $next = HealthRecord::where('done', false)->first();
    expect($record->fresh()->done)->toBeTrue();
    expect($next->date->toDateString())->toBe(now()->addMonthsNoOverflow(2)->toDateString());
});
