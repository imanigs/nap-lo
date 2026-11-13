<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ObservationResource extends JsonResource {
    public function toArray(Request $request): array {
        return [
            'id' => $this->id,
            'date' => $this->date->toDateString(),
            'height_cm' => $this->height_cm,
            'weight_kg' => $this->weight_kg,
            'health_rating' => $this->health_rating?->option(),
            'disposition_rating' => $this->disposition_rating?->option(),
            'performance_rating' => $this->performance_rating?->option(),
            'bcs_rating' => $this->bcs_rating?->option(),
            'notes' => $this->notes,
        ];
    }
}
