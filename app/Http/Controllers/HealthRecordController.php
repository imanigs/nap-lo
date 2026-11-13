<?php

namespace App\Http\Controllers;

use App\Http\Requests\Health\CompleteHealthRecordRequest;
use App\Http\Requests\Health\StoreHealthRecordRequest;
use App\Http\Requests\Health\UpdateHealthRecordRequest;
use App\Models\HealthRecord;
use App\Models\Horse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class HealthRecordController extends Controller {
    public function store(StoreHealthRecordRequest $request, Horse $horse) {
        DB::transaction(function () use ($request, $horse) {
            $healthRecord = $horse->healthRecords()
                ->make($request->safe()->except('remind_before'));
            $healthRecord->user_id = $request->user()->id;
            $healthRecord->save();
            $this->saveReminder($request, $healthRecord);

            if ($healthRecord->done) {
                $healthRecord->scheduleNext($healthRecord->time);
            }
        });

        return Inertia::flash('status', 'Bejegyzés rögzítve!')->back();
    }

    public function update(UpdateHealthRecordRequest $request, Horse $horse, HealthRecord $healthRecord) {
        $healthRecord->update($request->safe()->except('remind_before'));
        $this->saveReminder($request, $healthRecord);

        return Inertia::flash('status', 'Bejegyzés frissítve!')->back();
    }

    public function complete(CompleteHealthRecordRequest $request, Horse $horse, HealthRecord $healthRecord) {
        if (! $healthRecord->canComplete()) {
            return back()->withErrors(['done' => 'Ez a bejegyzés már késznek lett jelölve.']);
        }

        DB::transaction(function () use ($request, $healthRecord) {
            $this->saveReminder($request, $healthRecord);
            $healthRecord->complete($request->safe()->except('remind_before'));
        });

        return Inertia::flash('status', 'Bejegyzés kész!')->back();
    }

    public function destroy(Horse $horse, HealthRecord $healthRecord) {
        $healthRecord->delete();

        return Inertia::flash('status', 'Bejegyzés törölve!')->back();
    }

    protected function saveReminder(Request $request, HealthRecord $healthRecord): void {
        if ($request->has('remind_before')) {
            $healthRecord->remindUser($request->user(), $request->input('remind_before'));
        }
    }
}
