<?php

namespace App\Http\Controllers;

use App\Data\LogEntry;
use App\Enums\LogKind;
use App\Http\Resources\LogEntryResource;
use App\Services\LogEntryService;
use Carbon\CarbonImmutable;
use Illuminate\Http\Request;
use Illuminate\Support\Collection;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class CalendarController extends Controller {
    public function __invoke(Request $request, LogEntryService $logEntryService) {
        $user = $request->user();
        $filters = $request->validate([
            'month' => ['nullable', 'date_format:Y-m'],
            'day' => ['nullable', 'date_format:Y-m-d'],
            'horse' => ['nullable', 'integer'],
            'kinds' => ['nullable', 'array'],
            'kinds.*' => [Rule::enum(LogKind::class)],
        ]);

        $month = $this->selectedMonth($filters['month'] ?? null);
        $day = $this->selectedDay($filters['day'] ?? null, $month);
        $kinds = $this->selectedKinds($request);
        $horseId = $filters['horse'] ?? null;

        $logEntries = collect();

        if ($kinds->isNotEmpty()) {
            $logEntries = $logEntryService->between(
                $user,
                $month,
                $month->endOfMonth(),
                $kinds->all(),
                $horseId,
            );
        }

        return Inertia::render('calendar', [
            'month' => $month->format('Y-m'),
            'day' => $day,
            'horse' => $filters['horse'] ?? null,
            'kinds' => $kinds->map->value->all(),
            'horses' => $user->allHorses()
                ->map(fn ($horse) => ['id' => $horse->id, 'name' => $horse->name])
                ->values(),
            'days' => $this->countsPerDay($logEntries),
            'selected' => LogEntryResource::collection($this->entriesOfDay($logEntries, $day)),
        ]);
    }

    protected function selectedMonth(?string $selected): CarbonImmutable {
        $month = today()->format('Y-m');

        if ($selected !== null) {
            $month = $selected;
        }

        return CarbonImmutable::createFromFormat('Y-m-d', $month.'-01')->startOfDay();
    }

    protected function selectedDay(?string $selected, CarbonImmutable $month): string {
        $day = $month->toDateString();

        if ($month->isSameMonth(today())) {
            $day = today()->toDateString();
        }

        if ($selected !== null) {
            $day = $selected;
        }

        return $day;
    }

    protected function selectedKinds(Request $request): Collection {
        $kinds = collect(LogKind::cases());

        if ($request->has('kinds')) {
            $kinds = collect($request->enums('kinds', LogKind::class));
        }

        return $kinds;
    }

    protected function countsPerDay(Collection $logEntries): Collection {
        return $logEntries
            ->groupBy(fn (LogEntry $logEntry) => $logEntry->date->toDateString())
            ->map(fn ($group) => $group
                ->countBy(fn (LogEntry $logEntry) => $logEntry->kind->value));
    }

    protected function entriesOfDay(Collection $logEntries, string $day): Collection {
        return $logEntries
            ->filter(fn (LogEntry $logEntry) => $logEntry->date->toDateString() === $day)
            ->values();
    }
}
