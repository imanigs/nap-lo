<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class HealthRecordResource extends JsonResource {
    public function toArray(Request $request): array {
        $repeatUnit = null;

        if ($this->repeat_unit) {
            $repeatUnit = [
                'value' => $this->repeat_unit->value,
                'label' => $this->repeat_unit->label(),
            ];
        }

        return [
            'id' => $this->id,
            'label' => $this->label,
            'category' => [
                'value' => $this->category->value,
                'label' => $this->category->label(),
                'icon' => $this->category->icon(),
            ],
            'done' => $this->done,
            'date' => $this->date->toDateString(),
            'time' => $this->time ? substr($this->time, 0, 5) : null,
            'repeat_every' => $this->repeat_every,
            'repeat_unit' => $repeatUnit,
            'notes' => $this->notes,
            'remind_before' => $this->whenLoaded(
                'reminders',
                fn () => $this->reminders->first()?->days_before,
            ),
            'horse' => $this->whenLoaded('horse', fn () => new HorseResource($this->horse)),
        ];
    }
}
