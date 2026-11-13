<?php

namespace App\Data;

use App\Enums\LogKind;
use App\Models\Horse;
use Carbon\CarbonImmutable;

readonly class LogEntry {
    public string $key;

    public function __construct(
        public LogKind $kind,
        public int $logId,
        public Horse $horse,
        public string $title,
        public CarbonImmutable $date,
        public ?string $time,
        public ?bool $done,
        public array $detail = [],
    ) {
        $this->key = $kind->value.':'.$logId.':'.$date->format('Y-m-d\TH:i');
    }
}
