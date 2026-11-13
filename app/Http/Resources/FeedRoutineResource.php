<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class FeedRoutineResource extends JsonResource {
    public function toArray(Request $request): array {
        $unit = null;

        if ($this->unit) {
            $unit = [
                'value' => $this->unit->value,
                'label' => $this->unit->label(),
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
            'is_ad_lib' => $this->is_ad_lib,
            'quantity' => $this->quantity,
            'unit' => $unit,
            'days_of_week' => $this->days_of_week,
            'times_of_day' => $this->times_of_day,
            'starts_at' => $this->starts_at->toDateString(),
            'ends_at' => $this->ends_at?->toDateString(),
            'notes' => $this->notes,
            'horse' => $this->whenLoaded('horse', fn () => new HorseResource($this->horse)),
        ];
    }
}
