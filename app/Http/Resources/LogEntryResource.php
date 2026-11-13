<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class LogEntryResource extends JsonResource {
    public function toArray(Request $request): array {
        return [
            'key' => $this->key,
            'kind' => $this->kind->value,
            'horse' => HorseResource::make($this->horse),
            'log_id' => $this->logId,
            'title' => $this->title,
            'date' => $this->date->toDateString(),
            'time' => $this->time,
            'done' => $this->done,
            'detail' => $this->detail,
            'can_edit' => $this->horse->allows($request->user(), $this->kind->editAbility()),
        ];
    }
}
