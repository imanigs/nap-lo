<?php

namespace App\Http\Requests\Stable;

use App\Enums\Stable\StableRole;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreStableShareRequest extends FormRequest {
    public function rules(): array {
        return [
            'email' => ['required', 'email', 'max:255', 'exists:users,email'],
            'stable_role' => ['required', Rule::enum(StableRole::class)],
        ];
    }

    public function messages(): array {
        return [
            'email.exists' => 'Nincs ilyen felhasználó',
        ];
    }
}
