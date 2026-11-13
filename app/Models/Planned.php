<?php

namespace App\Models;

use App\Data\LogEntry;
use App\Interfaces\HasLogEntries;
use Carbon\CarbonImmutable;
use Carbon\CarbonInterface;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;

abstract class Planned extends HorseLog implements HasLogEntries {
    abstract protected function logEntryDetail(): array;

    protected function casts(): array {
        return [
            'done' => 'boolean',
            'date' => 'date',
        ];
    }

    public static function between(CarbonInterface $from, CarbonInterface $to, array $horseIds): Collection {
        return static::whereIn('horse_id', $horseIds)
            ->whereDate('date', '>=', $from->toDateString())
            ->whereDate('date', '<=', $to->toDateString())
            ->get();
    }

    public static function pendingBefore(CarbonInterface $date, array $horseIds): Collection {
        return static::whereIn('horse_id', $horseIds)
            ->where('done', false)
            ->whereDate('date', '<', $date->toDateString())
            ->orderBy('date')
            ->get();
    }

    public function date(): CarbonImmutable {
        $date = $this->date->startOfDay();

        if ($this->time) {
            $date = $this->date->setTimeFromTimeString($this->time);
        }

        return $date;
    }

    public function logEntry(): LogEntry {
        $date = $this->date();
        $time = null;

        if ($this->time) {
            $time = $date->format('H:i');
        }

        return new LogEntry(
            $this->kind(),
            $this->id,
            $this->horse,
            $this->label,
            $date,
            $time,
            $this->done,
            $this->logEntryDetail(),
        );
    }

    public function logEntriesBetween(CarbonInterface $from, CarbonInterface $to): Collection {
        $start = CarbonImmutable::instance($from);
        $end = CarbonImmutable::instance($to);

        if ($this->time === null) {
            $start = $start->startOfDay();
            $end = $end->endOfDay();
        }

        $logEntries = collect();

        if ($this->date()->betweenIncluded($start, $end)) {
            $logEntries->push($this->logEntry());
        }

        return $logEntries;
    }

    public function canComplete(): bool {
        return ! $this->done;
    }

    public function complete(array $outcome = []): void {
        $plannedTime = $this->time;
        $completed = array_merge($outcome, ['done' => true]);

        DB::transaction(function () use ($completed, $plannedTime) {
            $this->update($completed);
            $this->afterCompletion($plannedTime);
        });
    }

    protected function afterCompletion(?string $plannedTime): void {}
}
