<?php

use Illuminate\Notifications\DatabaseNotification;
use Illuminate\Support\Facades\Schedule;

Schedule::command('model:prune')->daily();
Schedule::command('reminders:send')->everyFiveMinutes()->withoutOverlapping();
Schedule::call(fn () => DatabaseNotification::where('created_at', '<', now()->subDays(30))
    ->delete())
    ->daily();
