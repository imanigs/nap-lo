<?php

namespace App\Models;

use App\Enums\LogKind;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

abstract class HorseLog extends Model {
    use SoftDeletes;

    abstract public function kind(): LogKind;

    public function horse(): BelongsTo {
        return $this->belongsTo(Horse::class);
    }
}
