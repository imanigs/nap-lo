<?php

namespace App\Http\Requests\Observation;

use App\Enums\Observation\BodyConditionScore;
use App\Enums\Observation\DispositionRating;
use App\Enums\Observation\HealthRating;
use App\Enums\Observation\PerformanceRating;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class ObservationRequest extends FormRequest {
    public function rules(): array {
        $otherValues = 'weight_kg,health_rating,disposition_rating,performance_rating,bcs_rating';

        return [
            'date' => [
                'required',
                'date',
                'after:2000-01-01',
                'before_or_equal:'.today()->toDateString(),
            ],
            'height_cm' => [
                'nullable',
                'integer',
                'between:20,250',
                'required_without_all:'.$otherValues,
            ],
            'weight_kg' => ['nullable', 'integer', 'between:20,2000'],
            'health_rating' => ['nullable', Rule::enum(HealthRating::class)],
            'disposition_rating' => ['nullable', Rule::enum(DispositionRating::class)],
            'performance_rating' => ['nullable', Rule::enum(PerformanceRating::class)],
            'bcs_rating' => ['nullable', Rule::enum(BodyConditionScore::class)],
            'notes' => ['nullable', 'string', 'max:255'],
        ];
    }

    public function messages(): array {
        return [
            'height_cm.required_without_all' => 'Legalább egy értéket adj meg.',
        ];
    }
}
