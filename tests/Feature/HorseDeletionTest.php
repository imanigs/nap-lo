<?php

use App\Models\Horse;
use App\Models\Observation;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

test('soft deleting a horse soft deletes its logs', function () {
    $horse = Horse::factory()->create();
    $horse->observations()->create([
        'date' => today(),
        'weight_kg' => 500,
    ]);

    $this->actingAs($horse->owner)->delete(route('horses.destroy', $horse));

    expect(Observation::count())->toBe(0);
    expect(Observation::withTrashed()->count())->toBe(1);
});

test('soft deleted horses are deleted after 30 days', function () {
    Storage::fake('local');
    $path = UploadedFile::fake()->image('teszt.jpg')->store('horses', 'local');
    $horse = Horse::factory()->create(['picture' => $path]);
    $horse->observations()->create([
        'date' => today(),
        'weight_kg' => 500,
    ]);
    $horse->delete();
    $this->travel(31)->days();

    $this->artisan('model:prune');

    expect(Horse::withTrashed()->count())->toBe(0);
    expect(Observation::withTrashed()->count())->toBe(0);
    Storage::disk('local')->assertMissing($path);
});
