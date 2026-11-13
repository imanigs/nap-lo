<?php

namespace App\Http\Requests\Exercise;

use App\Enums\Exercise\ExerciseCategory;
use App\Enums\Exercise\ExerciseIntensity;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateExerciseRequest extends FormRequest {
    public function rules(): array {
        $dateRules = ['required', 'date', 'after:2000-01-01'];

        if ($this->boolean('done')) {
            $dateRules[] = 'before_or_equal:'.today()->toDateString();
        }

        return [
            'label' => ['required', 'string', 'min:2', 'max:32'],
            'category' => ['required', Rule::enum(ExerciseCategory::class)],
            'done' => ['required', 'boolean'],
            'duration_minutes' => ['nullable', 'integer', 'between:1,1440'],
            'intensity' => ['nullable', Rule::enum(ExerciseIntensity::class)],
            'date' => $dateRules,
            'time' => ['nullable', 'date_format:H:i'],
            'notes' => ['nullable', 'string', 'max:255'],
        ];
    }
}
