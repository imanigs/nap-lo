<?php

namespace App\Http\Requests\Health;

use App\Enums\Health\HealthCategory;
use App\Enums\Health\HealthRepeatUnit;
use App\Models\Reminder;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateHealthRecordRequest extends FormRequest {
    public function rules(): array {
        $dateRules = ['required', 'date', 'after:2000-01-01'];

        if ($this->boolean('done')) {
            $dateRules[] = 'before_or_equal:'.today()->toDateString();
        }

        return [
            'label' => ['required', 'string', 'min:2', 'max:32'],
            'category' => ['required', Rule::enum(HealthCategory::class)],
            'done' => ['required', 'boolean'],
            'date' => $dateRules,
            'time' => ['nullable', 'date_format:H:i'],
            'repeat_every' => ['nullable', 'integer', 'between:1,365', 'required_with:repeat_unit'],
            'repeat_unit' => [
                'nullable',
                Rule::enum(HealthRepeatUnit::class),
                'required_with:repeat_every',
            ],
            'notes' => ['nullable', 'string', 'max:255'],
            'remind_before' => ['nullable', 'integer', Rule::in(Reminder::DAYS)],
        ];
    }
}
