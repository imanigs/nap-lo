<?php

namespace App\Observers;

use App\Actions\Horse\SaveHorsePictureAction;
use App\Models\Horse;
use Illuminate\Notifications\DatabaseNotification;

class HorseObserver {
    public function __construct(protected SaveHorsePictureAction $picture) {}

    public function deleted(Horse $horse): void {
        if ($horse->isForceDeleting()) {
            return;
        }

        foreach (Horse::LOGS as $relation) {
            $horse->$relation()->update(['deleted_at' => $horse->deleted_at]);
        }

        DatabaseNotification::where('data->horse_id', $horse->id)->delete();
    }

    public function forceDeleted(Horse $horse): void {
        $this->picture->delete($horse);
    }
}
