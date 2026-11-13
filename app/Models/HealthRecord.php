<?php

namespace App\Models;

use App\Enums\Health\HealthCategory;
use App\Enums\Health\HealthRepeatUnit;
use App\Enums\LogKind;
use Carbon\CarbonImmutable;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Notifications\DatabaseNotification;

class HealthRecord extends Planned {
    protected $fillable = [
        'label',
        'category',
        'done',
        'date',
        'time',
        'repeat_every',
        'repeat_unit',
        'notes',
    ];

    protected static function booted(): void {
        static::deleted(function (HealthRecord $record) {
            $record->deleteNotifications();
        });
    }

    protected function casts(): array {
        return array_merge(parent::casts(), [
            'category' => HealthCategory::class,
            'repeat_every' => 'integer',
            'repeat_unit' => HealthRepeatUnit::class,
        ]);
    }

    public function kind(): LogKind {
        return LogKind::Health;
    }

    public function reminders(): HasMany {
        return $this->hasMany(Reminder::class);
    }

    public function remindUser(User $user, ?int $daysBefore): void {
        if ($daysBefore === null) {
            $this->reminders()->where('user_id', $user->id)->delete();
        } else {
            $reminder = $this->reminders()->firstOrNew(['user_id' => $user->id]);
            $reminder->days_before = $daysBefore;

            if ($reminder->isDirty('days_before')) {
                $reminder->notified_for = null;
            }

            $reminder->save();
        }
    }

    public function deleteNotifications(): void {
        $notifications = DatabaseNotification::where('data->kind', $this->kind()->value)
            ->where('data->log_id', $this->id);

        $notifications->delete();
    }

    public function nextDate(): CarbonImmutable {
        $today = CarbonImmutable::today();
        $amount = $this->repeat_every;

        return match ($this->repeat_unit) {
            HealthRepeatUnit::DAY => $today->addDays($amount),
            HealthRepeatUnit::WEEK => $today->addWeeks($amount),
            HealthRepeatUnit::MONTH => $today->addMonthsNoOverflow($amount),
        };
    }

    public function scheduleNext(?string $time): void {
        if ($this->repeat_every) {
            $nextRecord = $this->replicate(['done', 'notes'])->forceFill([
                'date' => $this->nextDate()->toDateString(),
                'time' => $time,
                'done' => false,
                'notes' => null,
            ]);
            $nextRecord->save();

            $reminders = $this->reminders()->get(['user_id', 'days_before'])->toArray();
            $nextRecord->reminders()->createMany($reminders);
        }
    }

    protected function afterCompletion(?string $plannedTime): void {
        $nextTime = $plannedTime ?? $this->time;

        $this->deleteNotifications();
        $this->scheduleNext($nextTime);
    }

    protected function logEntryDetail(): array {
        return [
            'category' => [
                'value' => $this->category->value,
                'label' => $this->category->label(),
                'icon' => $this->category->icon(),
            ],
            'notes' => $this->notes,
        ];
    }
}
