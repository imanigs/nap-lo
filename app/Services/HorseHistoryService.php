<?php

namespace App\Services;

use App\Enums\Horse\HorseAbility;
use App\Enums\LogKind;
use App\Http\Resources\FeedRoutineResource;
use App\Http\Resources\LogEntryResource;
use App\Models\Horse;
use App\Models\User;
use Carbon\CarbonImmutable;

class HorseHistoryService {
    public function __construct(protected LogEntryService $logEntryService) {}

    public function for(Horse $horse, User $user, array $filters): array {
        $from = CarbonImmutable::parse($filters['from'] ?? today()->subDays(90));
        $to = CarbonImmutable::parse($filters['to'] ?? today());
        $allKinds = [
            LogKind::Exercise->value,
            LogKind::Health->value,
            LogKind::Observation->value,
            LogKind::Feed->value,
        ];
        $kinds = collect($filters['kinds'] ?? $allKinds)
            ->map(fn (string $kind) => LogKind::from($kind));
        $events = $kinds->reject(fn (LogKind $kind) => $kind === LogKind::Feed)->values()->all();

        $logEntries = collect();

        if ($events) {
            $logEntries = $this->logEntryService
                ->between($user, $from->startOfDay(), $to->endOfDay(), $events, $horse->id)
                ->reverse()
                ->take(500)
                ->values();
        }

        $routines = collect();

        if ($kinds->contains(LogKind::Feed) && $horse->allows($user, HorseAbility::VIEW_FEED)) {
            $routines = $horse->feedRoutines()
                ->whereDate('starts_at', '<=', $to->toDateString())
                ->where(fn ($query) => $query->whereNull('ends_at')
                    ->orWhereDate('ends_at', '>=', $from->toDateString()))
                ->orderByDesc('starts_at')
                ->get();
        }

        return [
            'from' => $from->toDateString(),
            'to' => $to->toDateString(),
            'kinds' => $kinds->map->value->all(),
            'log_entries' => LogEntryResource::collection($logEntries),
            'routines' => FeedRoutineResource::collection($routines),
        ];
    }
}
