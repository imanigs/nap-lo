<?php

namespace App\Http\Requests\Exercise;

use App\Enums\Exercise\ExerciseIntensity;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class CompleteExerciseRequest extends FormRequest {
    public function rules(): array {
        return [
            'duration_minutes' => ['nullable', 'integer', 'between:1,1440'],
            'intensity' => ['nullable', Rule::enum(ExerciseIntensity::class)],
            'time' => ['nullable', 'date_format:H:i'],
            'notes' => ['nullable', 'string', 'max:255'],
        ];
    }
}
