<?php

namespace App\Http\Requests\Horse;

use Illuminate\Foundation\Http\FormRequest;

class UpdateMeasurementRequest extends FormRequest {
    public function rules(): array {
        return [
            'girth_size' => ['nullable', 'string', 'max:32'],
            'bit_size' => ['nullable', 'string', 'max:32'],
            'blanket_size' => ['nullable', 'string', 'max:32'],
            'bridle_size' => ['nullable', 'string', 'max:32'],
            'saddle_size' => ['nullable', 'string', 'max:32'],
            'feet_size' => ['nullable', 'string', 'max:32'],
        ];
    }
}
