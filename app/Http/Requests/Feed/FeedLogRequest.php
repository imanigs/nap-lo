<?php

namespace App\Http\Requests\Feed;

use App\Data\LogEntry;
use Carbon\CarbonImmutable;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Validator;

class FeedLogRequest extends FormRequest {
    public function rules(): array {
        return [
            'date' => ['required', 'date_format:Y-m-d', 'before_or_equal:'.today()->toDateString()],
            'time' => ['required', 'date_format:H:i'],
        ];
    }

    public function after(): array {
        return [
            function (Validator $validator) {
                $hasOtherErrors = $validator->errors()->isNotEmpty();

                if (! $hasOtherErrors && $this->logEntry() === null) {
                    $validator->errors()->add(
                        'time',
                        'Hiba',
                    );
                }
            },
        ];
    }

    public function logEntry(): ?LogEntry {
        $dateAndTime = $this->input('date').' '.$this->input('time');
        $startsAt = CarbonImmutable::createFromFormat('Y-m-d H:i', $dateAndTime);
        $routine = $this->route('feed_routine')->loadMissing('horse', 'feedLogs');

        return $routine->logEntriesBetween($startsAt, $startsAt)->first();
    }
}
