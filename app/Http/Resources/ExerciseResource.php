<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ExerciseResource extends JsonResource {
    public function toArray(Request $request): array {
        $intensity = null;

        if ($this->intensity) {
            $intensity = [
                'value' => $this->intensity->value,
                'label' => $this->intensity->label(),
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
            'duration_minutes' => $this->duration_minutes,
            'intensity' => $intensity,
            'date' => $this->date->toDateString(),
            'time' => $this->time ? substr($this->time, 0, 5) : null,
            'notes' => $this->notes,
            'horse' => $this->whenLoaded('horse', fn () => new HorseResource($this->horse)),
        ];
    }
}
