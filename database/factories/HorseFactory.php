<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class HorseFactory extends Factory {
    public function definition(): array {
        return [
            'name' => fake()->firstName(),
            'gender' => 'mare',
            'owner_id' => User::factory(),
            'stable_id' => fn (array $attributes) => User::find($attributes['owner_id'])
                ->ownStable()->id,
        ];
    }

    public function ownedBy(User $owner): static {
        return $this->state([
            'owner_id' => $owner->id,
            'stable_id' => $owner->ownStable()->id,
        ]);
    }
}
