<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class Measurement extends Model {
    use SoftDeletes;

    protected $fillable = [
        'girth_size',
        'bit_size',
        'blanket_size',
        'bridle_size',
        'saddle_size',
        'feet_size',
    ];

    public function horse(): BelongsTo {
        return $this->belongsTo(Horse::class);
    }
}
