<?php

namespace App\Http\Controllers;

use App\Http\Requests\Exercise\CompleteExerciseRequest;
use App\Http\Requests\Exercise\StoreExerciseRequest;
use App\Http\Requests\Exercise\UpdateExerciseRequest;
use App\Models\Exercise;
use App\Models\Horse;
use Inertia\Inertia;

class ExerciseController extends Controller {
    public function store(StoreExerciseRequest $request, Horse $horse) {
        $exercise = $horse->exercises()->make($request->validated());
        $exercise->user_id = $request->user()->id;
        $exercise->save();

        return Inertia::flash('status', 'Edzés rögzítve!')->back();
    }

    public function update(UpdateExerciseRequest $request, Horse $horse, Exercise $exercise) {
        $exercise->update($request->validated());

        return Inertia::flash('status', 'Edzés frissítve!')->back();
    }

    public function complete(CompleteExerciseRequest $request, Horse $horse, Exercise $exercise) {
        if (! $exercise->canComplete()) {
            return back()->withErrors(['done' => 'Ezt az edzést nem lehet késznek jelölni.']);
        }

        $exercise->complete($request->validated());

        return Inertia::flash('status', 'Edzés rögzítve!')->back();
    }

    public function destroy(Horse $horse, Exercise $exercise) {
        $exercise->delete();

        return Inertia::flash('status', 'Edzés törölve!')->back();
    }
}
