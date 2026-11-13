<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class UserFactory extends Factory {
    public function configure(): static {
        return $this->afterCreating(function (User $user) {
            $user->ownStable();
        });
    }

    public function definition(): array {
        return [
            'first_name' => fake()->firstName(),
            'last_name' => fake()->lastName(),
            'email' => fake()->unique()->safeEmail(),
            'email_verified_at' => now(),
            'password' => 'password',
        ];
    }

    public function unverified(): static {
        return $this->state(['email_verified_at' => null]);
    }
}
