<?php

namespace App\Http\Controllers;

use App\Http\Requests\Observation\ObservationRequest;
use App\Models\Horse;
use App\Models\Observation;
use Inertia\Inertia;

class ObservationController extends Controller {
    public function store(ObservationRequest $request, Horse $horse) {
        $observation = $horse->observations()->make($request->validated());
        $observation->user_id = $request->user()->id;
        $observation->save();

        return Inertia::flash('status', 'Megfigyelés rögzítve!')->back();
    }

    public function update(ObservationRequest $request, Horse $horse, Observation $observation) {
        $observation->update($request->validated());

        return Inertia::flash('status', 'Megfigyelés frissítve!')->back();
    }

    public function destroy(Horse $horse, Observation $observation) {
        $observation->delete();

        return Inertia::flash('status', 'Megfigyelés törölve!')->back();
    }
}
