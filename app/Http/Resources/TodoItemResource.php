<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class TodoItemResource extends JsonResource {
    public function toArray(Request $request): array {
        return [
            'id' => $this->id,
            'title' => $this->title,
            'is_completed' => $this->is_completed,
            'completed_by' => $this->completedBy($request),
        ];
    }

    protected function completedBy(Request $request): ?string {
        $otherUser = $this->is_completed && $this->completed_by !== $request->user()->id;
        $name = null;

        if ($otherUser) {
            $name = $this->completedBy?->name ?? 'Törölt felhasználó';
        }

        return $name;
    }
}
