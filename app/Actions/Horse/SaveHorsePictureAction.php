<?php

namespace App\Actions\Horse;

use App\Models\Horse;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

class SaveHorsePictureAction {
    public function execute(Horse $horse, UploadedFile $picture): string {
        $fileName = 'horse_'.$horse->id.'_'.time().'.'.$picture->extension();
        $path = $picture->storeAs('horses', $fileName, 'local');

        $this->delete($horse);

        return $path;
    }

    public function delete(Horse $horse): void {
        if ($horse->picture) {
            Storage::disk('local')->delete($horse->picture);
        }
    }
}
