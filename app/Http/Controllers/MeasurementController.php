<?php

namespace App\Http\Controllers;

use App\Http\Requests\Horse\UpdateMeasurementRequest;
use App\Http\Resources\HorseResource;
use App\Http\Resources\MeasurementResource;
use App\Models\Horse;
use App\Models\Measurement;
use Illuminate\Http\Request;
use Inertia\Inertia;

class MeasurementController extends Controller {
    public function edit(Request $request, Horse $horse) {
        $measurement = $horse->measurement;

        if (! $measurement) {
            $measurement = new Measurement;
        }

        return Inertia::render('horses/measurements', [
            'horse' => HorseResource::make($horse),
            'abilities' => $horse->abilitiesFor($request->user()),
            'measurement' => MeasurementResource::make($measurement),
        ]);
    }

    public function update(UpdateMeasurementRequest $request, Horse $horse) {
        $horse->measurement()->updateOrCreate([], $request->validated());

        return Inertia::flash('status', 'Méretek frissítve!')->back();
    }
}
