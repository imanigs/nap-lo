<?php

namespace App\Http\Controllers;

use App\Enums\Horse\HorseAbility;
use App\Http\Resources\LogEntryResource;
use App\Models\Reminder;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ReminderController extends Controller {
    public function index(Request $request) {
        $user = $request->user();

        $reminders = $user->reminders()
            ->with('healthRecord.horse.stable')
            ->get();

        $activeReminders = $reminders
            ->filter(fn (Reminder $reminder) => $this->isActive($reminder, $user))
            ->sortBy(fn (Reminder $reminder) => $reminder->healthRecord->date())
            ->values();

        $reminderRows = $activeReminders->map(fn (Reminder $reminder) => [
            'id' => $reminder->id,
            'days_before' => $reminder->days_before,
            'log_entry' => LogEntryResource::make($reminder->healthRecord->logEntry()),
        ]);

        return Inertia::render('reminders', [
            'reminders' => $reminderRows,
        ]);
    }

    public function destroy(Request $request, int $reminder) {
        $request->user()->reminders()->findOrFail($reminder)->delete();

        return Inertia::flash('status', 'Emlékeztető törölve!')->back();
    }

    protected function isActive(Reminder $reminder, User $user): bool {
        $record = $reminder->healthRecord;

        $isActive = false;

        if ($record && ! $record->done) {
            $isActive = $record->horse->allows($user, HorseAbility::VIEW_HEALTH);
        }

        return $isActive;
    }
}
