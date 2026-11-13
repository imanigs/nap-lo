<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class TodoList extends Model {
    protected $fillable = [
        'title',
    ];

    public function stable(): BelongsTo {
        return $this->belongsTo(Stable::class);
    }

    public function items(): HasMany {
        return $this->hasMany(TodoItem::class)->orderBy('is_completed')->orderBy('id');
    }
}
