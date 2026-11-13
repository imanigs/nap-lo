<?php

namespace App\Console\Commands;

use App\Models\Reminder;
use App\Notifications\LogEntryReminder;
use Illuminate\Console\Command;

class SendReminders extends Command {
    protected $signature = 'reminders:send';

    protected $description = 'Emlékeztetők elküldése a felhasználóknak';

    public function handle(): void {
        $reminders = Reminder::with([
            'user.sharedHorses',
            'user.sharedStables',
            'healthRecord.horse.stable',
        ])->get();

        foreach ($reminders as $reminder) {
            $logEntry = $reminder->shouldRemind();

            if ($logEntry !== null) {
                $reminder->user->notify(new LogEntryReminder($logEntry));
                $reminder->update(['notified_for' => $logEntry->date]);
            }
        }
    }
}
