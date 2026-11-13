<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class HorseResource extends JsonResource {
    public function toArray(Request $request): array {
        $picture = null;

        if ($this->picture) {
            $picture = route('horses.picture', [
                'horse' => $this->id,
                'version' => $this->updated_at->timestamp,
            ], false);
        }

        return [
            'id' => $this->id,
            'name' => $this->name,
            'gender' => $this->gender->label(),
            'birth_date' => $this->birth_date,
            'status' => $this->status,
            'breed' => $this->breed,
            'picture' => $picture,
            'notes' => $this->notes,
        ];
    }
}
