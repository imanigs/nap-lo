<?php

namespace App\Http\Requests\Horse;

use App\Enums\Horse\Gender;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateHorseRequest extends FormRequest {
    public function rules(): array {
        return [
            'name' => ['required', 'string', 'max:64'],
            'gender' => ['required', Rule::enum(Gender::class)],
            'birth_date' => ['nullable', 'date', 'before_or_equal:'.today()->toDateString()],
            'breed' => ['nullable', 'string', 'max:32'],
            'status' => ['nullable', 'string', 'max:32'],
            'notes' => ['nullable', 'string', 'max:5000'],
            'picture' => ['nullable', 'image', 'max:2048'],
            'remove_picture' => ['nullable', 'boolean'],
        ];
    }
}
