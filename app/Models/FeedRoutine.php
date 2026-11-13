<?php

namespace App\Models;

use App\Data\LogEntry;
use App\Enums\Feed\FeedCategory;
use App\Enums\Feed\FeedUnit;
use App\Enums\LogKind;
use App\Interfaces\HasLogEntries;
use Carbon\CarbonImmutable;
use Carbon\CarbonInterface;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Collection;

class FeedRoutine extends HorseLog implements HasLogEntries {
    protected $fillable = [
        'label',
        'category',
        'is_ad_lib',
        'quantity',
        'unit',
        'days_of_week',
        'times_of_day',
        'starts_at',
        'ends_at',
        'notes',
    ];

    protected function casts(): array {
        return [
            'category' => FeedCategory::class,
            'unit' => FeedUnit::class,
            'is_ad_lib' => 'boolean',
            'quantity' => 'float',
            'days_of_week' => 'array',
            'times_of_day' => 'array',
            'starts_at' => 'date',
            'ends_at' => 'date',
        ];
    }

    public function kind(): LogKind {
        return LogKind::Feed;
    }

    public function feedLogs(): HasMany {
        return $this->hasMany(FeedLog::class);
    }

    public static function between(CarbonInterface $from, CarbonInterface $to, array $horseIds): Collection {
        return static::where('is_ad_lib', false)
            ->whereIn('horse_id', $horseIds)
            ->whereDate('starts_at', '<=', $to->toDateString())
            ->where(fn ($query) => $query->whereNull('ends_at')
                ->orWhereDate('ends_at', '>=', $from->toDateString()))
            ->with(['feedLogs' => fn ($query) => $query
                ->whereDate('date', '>=', $from->toDateString())
                ->whereDate('date', '<=', $to->toDateString())])
            ->get();
    }

    public function logEntriesBetween(CarbonInterface $from, CarbonInterface $to): Collection {
        $from = CarbonImmutable::instance($from);
        $to = CarbonImmutable::instance($to);
        $first = $from->startOfDay()->max($this->starts_at->startOfDay());
        $last = $this->ends_at
            ? $to->startOfDay()->min($this->ends_at->startOfDay())
            : $to->startOfDay();
        $logEntries = collect();

        for ($day = $first; $day->lte($last); $day = $day->addDay()) {
            if (! in_array($day->isoWeekday(), $this->days_of_week ?? [], true)) {
                continue;
            }

            foreach ($this->times_of_day ?? [] as $time) {
                $startsAt = $day->setTimeFromTimeString($time);

                if ($startsAt->betweenIncluded($from, $to)) {
                    $logEntries->push($this->makeLogEntry($startsAt));
                }
            }
        }

        return $logEntries;
    }

    public function completeLogEntry(LogEntry $logEntry): void {
        $exists = $this->feedLogs()
            ->whereDate('date', $logEntry->date->toDateString())
            ->where('time', $logEntry->time)
            ->exists();

        if (! $exists) {
            $this->feedLogs()->create([
                'date' => $logEntry->date->toDateString(),
                'time' => $logEntry->time,
            ]);
        }
    }

    public function undoLogEntry(LogEntry $logEntry): void {
        $this->feedLogs()
            ->whereDate('date', $logEntry->date->toDateString())
            ->where('time', $logEntry->time)
            ->delete();
    }

    protected function makeLogEntry(CarbonImmutable $startsAt): LogEntry {
        $time = $startsAt->format('H:i');

        return new LogEntry(
            $this->kind(),
            $this->id,
            $this->horse,
            $this->label,
            $startsAt,
            $time,
            $this->feedLogs->contains(
                fn (FeedLog $log) => $log->date->toDateString() === $startsAt->toDateString()
                    && substr($log->time, 0, 5) === $time
            ),
            [
                'category' => [
                    'value' => $this->category->value,
                    'label' => $this->category->label(),
                    'icon' => $this->category->icon(),
                ],
                'quantity' => $this->quantity,
                'unit' => $this->unit?->label(),
            ],
        );
    }
}
