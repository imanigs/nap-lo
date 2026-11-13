<?php

namespace App\Http\Requests\Health;

use App\Models\Reminder;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class CompleteHealthRecordRequest extends FormRequest {
    public function rules(): array {
        return [
            'date' => [
                'required',
                'date',
                'after:2000-01-01',
                'before_or_equal:'.today()->toDateString(),
            ],
            'time' => ['nullable', 'date_format:H:i'],
            'notes' => ['nullable', 'string', 'max:255'],
            'remind_before' => ['nullable', 'integer', Rule::in(Reminder::DAYS)],
        ];
    }
}
