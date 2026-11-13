<?php

namespace App\Services;

use App\Data\LogEntry;
use App\Enums\LogKind;
use App\Models\User;
use Carbon\CarbonInterface;
use Illuminate\Support\Collection;

class LogEntryService {
    public function between(User $user, CarbonInterface $from, CarbonInterface $to, array $kinds = [], ?int $horseId = null): Collection {
        if ($kinds === []) {
            $kinds = LogKind::cases();
        }

        $horses = $this->horses($user, $horseId);
        $logEntries = collect();

        foreach ($kinds as $kind) {
            $visibleHorses = $this->visibleTo($user, $horses, $kind);
            $horseIds = $visibleHorses->keys()->all();
            $model = $kind->model();

            foreach ($model::between($from, $to, $horseIds) as $log) {
                $log->setRelation('horse', $visibleHorses[$log->horse_id]);

                $entriesOfLog = $log->logEntriesBetween($from, $to);
                $logEntries = $logEntries->merge($entriesOfLog);
            }
        }

        $sortedEntries = $logEntries->sortBy(function (LogEntry $logEntry) {
            return $logEntry->date->format('Y-m-d H:i').$logEntry->kind->value;
        });

        return $sortedEntries->values();
    }

    public function overdue(User $user, CarbonInterface $before): Collection {
        $horses = $this->horses($user);
        $logEntries = collect();

        foreach ([LogKind::Exercise, LogKind::Health] as $kind) {
            $visibleHorses = $this->visibleTo($user, $horses, $kind);
            $horseIds = $visibleHorses->keys()->all();
            $model = $kind->model();

            foreach ($model::pendingBefore($before, $horseIds) as $log) {
                $log->setRelation('horse', $visibleHorses[$log->horse_id]);
                $logEntries->push($log->logEntry());
            }
        }

        $sortedEntries = $logEntries->sortBy(fn (LogEntry $logEntry) => $logEntry->date);

        return $sortedEntries->values();
    }

    protected function horses(User $user, ?int $horseId = null): Collection {
        $horses = $user->allHorses()->keyBy('id');

        if ($horseId !== null) {
            $horses = $horses->filter(fn ($horse) => $horse->id === $horseId);
        }

        return $horses;
    }

    protected function visibleTo(User $user, Collection $horses, LogKind $kind): Collection {
        return $horses->filter(fn ($horse) => $horse->allows($user, $kind->viewAbility()));
    }
}
