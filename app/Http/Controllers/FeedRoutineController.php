<?php

namespace App\Http\Controllers;

use App\Http\Requests\Feed\FeedRoutineRequest;
use App\Models\FeedRoutine;
use App\Models\Horse;
use Illuminate\Http\Request;
use Inertia\Inertia;

class FeedRoutineController extends Controller {
    public function store(FeedRoutineRequest $request, Horse $horse) {
        $feedRoutine = $horse->feedRoutines()->make($this->orderTimeArrays($request));
        $feedRoutine->user_id = $request->user()->id;
        $feedRoutine->save();

        return Inertia::flash('status', 'Rutin hozzáadva!')->back();
    }

    public function update(FeedRoutineRequest $request, Horse $horse, FeedRoutine $feedRoutine) {
        $feedRoutine->update($this->orderTimeArrays($request));

        return Inertia::flash('status', 'Rutin frissítve!')->back();
    }

    public function close(Request $request, Horse $horse, FeedRoutine $feedRoutine) {
        $feedRoutine->update($request->validate([
            'ends_at' => [
                'required',
                'date',
                'after_or_equal:'.$feedRoutine->starts_at->toDateString(),
            ],
        ]));

        return Inertia::flash('status', 'Rutin lezárva!')->back();
    }

    public function destroy(Horse $horse, FeedRoutine $feedRoutine) {
        $feedRoutine->delete();

        return Inertia::flash('status', 'Rutin törölve!')->back();
    }

    protected function orderTimeArrays(FeedRoutineRequest $request): array {
        $data = $request->validated();

        if (! empty($data['days_of_week'])) {
            $data['days_of_week'] = collect($data['days_of_week'])
                ->map(fn ($day) => (int) $day)
                ->sort()->values()->all();
        }

        if (! empty($data['times_of_day'])) {
            $data['times_of_day'] = collect($data['times_of_day'])->sort()->values()->all();
        }

        return $data;
    }
}
