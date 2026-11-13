<?php

namespace App\Models;

use App\Data\LogEntry;
use App\Enums\Horse\HorseAbility;
use Carbon\CarbonImmutable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Reminder extends Model {
    public const DAYS = [1, 3, 7];

    public const SEND_HOUR = 8;

    protected $fillable = [
        'user_id',
        'days_before',
        'notified_for',
    ];

    protected function casts(): array {
        return [
            'days_before' => 'integer',
            'notified_for' => 'datetime',
        ];
    }

    public function healthRecord(): BelongsTo {
        return $this->belongsTo(HealthRecord::class);
    }

    public function user(): BelongsTo {
        return $this->belongsTo(User::class);
    }

    public function shouldRemind(): ?LogEntry {
        $record = $this->healthRecord;
        $isOpen = $record && ! $record->done;
        $toSend = null;

        if ($isOpen && $record->horse->allows($this->user, HorseAbility::VIEW_HEALTH)) {
            $now = CarbonImmutable::now();
            $logEntry = $record->logEntry();

            $isTime = $this->remindAt($logEntry)->lessThanOrEqualTo($now);
            $isOver = $this->isOver($logEntry, $now);
            $sent = $this->notified_for?->equalTo($logEntry->date);

            if ($isTime && ! $isOver && ! $sent) {
                $toSend = $logEntry;
            }
        }

        return $toSend;
    }

    protected function remindAt(LogEntry $logEntry): CarbonImmutable {
        return $logEntry->date->startOfDay()
            ->subDays($this->days_before)
            ->setTime(self::SEND_HOUR, 0);
    }

    protected function isOver(LogEntry $logEntry, CarbonImmutable $now): bool {
        $end = $logEntry->date;

        if ($logEntry->time === null) {
            $end = $end->endOfDay();
        }

        return $end->lessThan($now);
    }
}
