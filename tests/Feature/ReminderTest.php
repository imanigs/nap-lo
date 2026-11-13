<?php

use App\Models\HealthRecord;
use App\Models\Horse;
use App\Models\Reminder;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Notification;

test('the reminder of a repeating record gets created for the next one', function () {
    $horse = Horse::factory()->create();

    $this->actingAs($horse->owner)->post(route('horses.health-records.store', $horse), [
        'label' => 'teszt',
        'category' => 'vaccination',
        'done' => true,
        'date' => today()->toDateString(),
        'repeat_every' => 6,
        'repeat_unit' => 'week',
        'remind_before' => 3,
    ])->assertSessionHasNoErrors();

    $next = HealthRecord::where('done', false)->first();

    expect($next->reminders)->toHaveCount(1);
    expect($next->reminders->first()->days_before)->toBe(3);
});

test('reminder doesnt send after the event', function () {
    Notification::fake();
    $this->travelTo('2030-03-10 09:00:00');
    $horse = Horse::factory()->create();
    $horse->healthRecords()->create([
        'label' => 'teszt',
        'category' => 'vaccination',
        'date' => '2030-03-09',
    ])->remindUser($horse->owner, 1);

    Artisan::call('reminders:send');

    Notification::assertNothingSent();
});

test('a finished records reminder doesnt send', function () {
    Notification::fake();
    $this->travelTo('2030-03-10 09:00:00');
    $horse = Horse::factory()->create();
    $horse->healthRecords()->create([
        'label' => 'teszt',
        'category' => 'vaccination',
        'date' => '2030-03-11',
        'done' => true,
    ])->remindUser($horse->owner, 1);

    Artisan::call('reminders:send');

    Notification::assertNothingSent();
});

test('deleting a log removes its reminders', function () {
    $horse = Horse::factory()->create();
    $record = $horse->healthRecords()->create([
        'label' => 'teszt',
        'category' => 'vaccination',
        'date' => '2030-03-11',
    ]);
    $record->remindUser($horse->owner, 1);

    $record->forceDelete();

    expect(Reminder::count())->toBe(0);
});
