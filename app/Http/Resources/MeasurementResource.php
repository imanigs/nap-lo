<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class MeasurementResource extends JsonResource {
    public function toArray(Request $request): array {
        return [
            'girth_size' => $this->girth_size,
            'bit_size' => $this->bit_size,
            'blanket_size' => $this->blanket_size,
            'bridle_size' => $this->bridle_size,
            'saddle_size' => $this->saddle_size,
            'feet_size' => $this->feet_size,
        ];
    }
}
