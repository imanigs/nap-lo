<?php

namespace App\Http\Requests\Horse;

use App\Enums\Horse\HorseRole;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreHorseShareRequest extends FormRequest {
    public function rules(): array {
        return [
            'email' => ['required', 'email', 'max:255', 'exists:users,email'],
            'horse_role' => ['required', Rule::enum(HorseRole::class)],
        ];
    }

    public function messages(): array {
        return [
            'email.exists' => 'Nincs ilyen felhasználó',
        ];
    }
}
