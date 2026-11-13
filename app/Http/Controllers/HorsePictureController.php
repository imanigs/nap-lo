<?php

namespace App\Http\Controllers;

use App\Models\Horse;
use Illuminate\Support\Facades\Storage;
use Symfony\Component\HttpFoundation\BinaryFileResponse;

class HorsePictureController extends Controller {
    public function __invoke(Horse $horse): BinaryFileResponse {
        if (! $horse->picture) {
            abort(404);
        }

        return response()->file(Storage::disk('local')->path($horse->picture));
    }
}
