<?php

namespace App\Http\Requests\Feed;

use App\Enums\Feed\FeedCategory;
use App\Enums\Feed\FeedUnit;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class FeedRoutineRequest extends FormRequest {
    protected function prepareForValidation(): void {
        $isAdLib = $this->boolean('is_ad_lib');

        $this->merge(['is_ad_lib' => $isAdLib]);

        if ($isAdLib) {
            $this->merge(['quantity' => null, 'unit' => null, 'times_of_day' => null]);
        }
    }

    public function rules(): array {
        $isMeasured = ! $this->boolean('is_ad_lib');

        return [
            'label' => ['required', 'string', 'min:2', 'max:32'],
            'category' => ['required', Rule::enum(FeedCategory::class)],
            'is_ad_lib' => ['boolean'],
            'quantity' => [
                Rule::requiredIf($isMeasured),
                'nullable',
                'numeric',
                'decimal:0,2',
                'min:0.01',
                'max:99999.99',
            ],
            'unit' => [Rule::requiredIf($isMeasured), 'nullable', Rule::enum(FeedUnit::class)],
            'days_of_week' => [Rule::requiredIf($isMeasured), 'nullable', 'array', 'min:1', 'max:7'],
            'days_of_week.*' => ['integer', 'between:1,7', 'distinct'],
            'times_of_day' => [Rule::requiredIf($isMeasured), 'nullable', 'array', 'min:1', 'max:12'],
            'times_of_day.*' => ['date_format:H:i', 'distinct'],
            'starts_at' => ['required', 'date', 'after:2000-01-01'],
            'ends_at' => ['nullable', 'date', 'after_or_equal:starts_at'],
            'notes' => ['nullable', 'string', 'max:100'],
        ];
    }

    public function messages(): array {
        return [
            'quantity.decimal' => 'A mennyiség legfeljebb két tizedesjegyet tartalmazhat.',
        ];
    }
}
