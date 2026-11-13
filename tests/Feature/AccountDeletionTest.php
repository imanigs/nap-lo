<?php

use App\Models\Horse;
use App\Models\Stable;
use App\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

test("an account can't be deleted if the user owns a horse", function () {
    $horse = Horse::factory()->create();

    $this->actingAs($horse->owner)
        ->delete(route('settings.destroy'), ['password' => 'password'])
        ->assertSessionHasErrors('password');
    expect(User::find($horse->owner_id))->not->toBeNull();
    expect(Horse::count())->toBe(1);
});

test('deleted horses of the user actually get deleted', function () {
    Storage::fake('local');
    $path = UploadedFile::fake()->image('teszt.jpg')->store('horses', 'local');
    $horse = Horse::factory()->create(['picture' => $path]);
    $horse->observations()->create([
        'date' => today(),
        'weight_kg' => 500,
    ]);
    $horse->delete();

    $this->actingAs($horse->owner)->delete(route('settings.destroy'), ['password' => 'password']);

    expect(Horse::withTrashed()->count())->toBe(0);
    expect(DB::table('observations')->count())->toBe(0);
    Storage::disk('local')->assertMissing($path);
});

test('shares given by the deleted user are deleted', function () {
    $giver = User::factory()->create();
    $friend = User::factory()->create();
    $horse = Horse::factory()->create();
    $horse->users()->attach($friend, ['horse_role' => 'viewer', 'giver_id' => $giver->id]);

    $this->actingAs($giver)->delete(route('settings.destroy'), ['password' => 'password']);

    expect(DB::table('horse_user')->count())->toBe(0);
    expect(Horse::count())->toBe(1);
});

test('shares of the deleted user are deleted', function () {
    $member = User::factory()->create();
    $horse = Horse::factory()->create();
    User::factory()->create()->ownStable()->users()->attach($member, ['stable_role' => 'viewer']);
    $horse->users()->attach($member, ['horse_role' => 'viewer']);

    $this->actingAs($member)->delete(route('settings.destroy'), ['password' => 'password']);

    expect(DB::table('stable_user')->count())->toBe(0);
    expect(DB::table('horse_user')->count())->toBe(0);
});

test('no db junk is left behind on user deletion', function () {
    $user = User::factory()->create();
    $stable = $user->ownStable();
    $stable->todoLists()->create(['title' => 'teszt'])->items()->create(['title' => 'teszt']);
    $stable->users()->attach(User::factory()->create(), ['stable_role' => 'viewer']);
    DB::table('password_reset_tokens')->insert([
        'email' => $user->email,
        'token' => 'teszt',
        'created_at' => now(),
    ]);

    $this->actingAs($user)->delete(route('settings.destroy'), ['password' => 'password']);

    expect(Stable::where('owner_id', $user->id)->count())->toBe(0);
    expect(DB::table('todo_lists')->count())->toBe(0);
    expect(DB::table('todo_items')->count())->toBe(0);
    expect(DB::table('stable_user')->count())->toBe(0);
    expect(DB::table('password_reset_tokens')->count())->toBe(0);
});
