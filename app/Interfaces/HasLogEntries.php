<?php

namespace App\Interfaces;

use Carbon\CarbonInterface;
use Illuminate\Support\Collection;

interface HasLogEntries {
    public static function between(CarbonInterface $from, CarbonInterface $to, array $horseIds): Collection;

    public function logEntriesBetween(CarbonInterface $from, CarbonInterface $to): Collection;
}
