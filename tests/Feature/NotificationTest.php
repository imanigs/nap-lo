<?php

use App\Models\Horse;
use App\Models\User;
use App\Notifications\LogEntryReminder;
use Illuminate\Notifications\DatabaseNotification;

test('completing a record removes its notifications', function () {
    $horse = Horse::factory()->create();
    $record = $horse->healthRecords()->create([
        'label' => 'teszt',
        'category' => 'vaccination',
        'date' => today(),
    ]);
    $record->remindUser($horse->owner, 1);
    $horse->owner->notify(new LogEntryReminder($record->logEntry()));

    $this->actingAs($horse->owner)
        ->post(route('horses.health-records.complete', [$horse, $record]), [
            'date' => today()->toDateString(),
        ]);

    expect($horse->owner->notifications()->count())->toBe(0);
});

test('deleting a record removes its notifications', function () {
    $horse = Horse::factory()->create();
    $record = $horse->healthRecords()->create([
        'label' => 'teszt',
        'category' => 'vaccination',
        'date' => today(),
    ]);
    $record->remindUser($horse->owner, 1);
    $horse->owner->notify(new LogEntryReminder($record->logEntry()));

    $this->actingAs($horse->owner)
        ->delete(route('horses.health-records.destroy', [$horse, $record]));

    expect($horse->owner->notifications()->count())->toBe(0);
});

test('deleting a horse removes the notifications tied to it', function () {
    $horse = Horse::factory()->create();
    $other = Horse::factory()->ownedBy($horse->owner)->create();
    $friend = User::factory()->create();
    $horse->users()->attach($friend, ['horse_role' => 'viewer']);
    $record = $horse->healthRecords()->create([
        'label' => 'teszt',
        'category' => 'vaccination',
        'date' => today()->addDays(3),
    ]);
    $otherRecord = $other->healthRecords()->create([
        'label' => 'teszt',
        'category' => 'vaccination',
        'date' => today()->addDays(3),
    ]);
    $horse->owner->notify(new LogEntryReminder($record->logEntry()));
    $horse->owner->notify(new LogEntryReminder($otherRecord->logEntry()));
    $friend->notify(new LogEntryReminder($record->logEntry()));

    $this->actingAs($horse->owner)->delete(route('horses.destroy', $horse));

    expect($friend->notifications()->count())->toBe(0);
    expect($horse->owner->notifications()->count())->toBe(1);
    expect($horse->owner->notifications()->first()->data['horse_id'])->toBe($other->id);
});

test('removing a horse share removes the notifications tied to that horse', function () {
    $horse = Horse::factory()->create();
    $friend = User::factory()->create();
    $horse->users()->attach($friend, ['horse_role' => 'viewer']);
    $record = $horse->healthRecords()->create([
        'label' => 'teszt',
        'category' => 'vaccination',
        'date' => today()->addDays(3),
    ]);
    $friend->notify(new LogEntryReminder($record->logEntry()));

    $this->actingAs($horse->owner)->delete(route('horses.shares.destroy', [$horse, $friend]));

    expect($friend->notifications()->count())->toBe(0);
});

test('deleting an account removes its notifications', function () {
    $horse = Horse::factory()->create();
    $friend = User::factory()->create();
    $horse->users()->attach($friend, ['horse_role' => 'viewer']);
    $record = $horse->healthRecords()->create([
        'label' => 'teszt',
        'category' => 'vaccination',
        'date' => today()->addDays(3),
    ]);
    $friend->notify(new LogEntryReminder($record->logEntry()));

    $this->actingAs($friend)
        ->delete(route('settings.destroy'), ['password' => 'password'])
        ->assertSessionHasNoErrors();

    expect(DatabaseNotification::count())->toBe(0);
});
