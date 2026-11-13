<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class TodoItem extends Model {
    protected $fillable = [
        'title',
        'is_completed',
        'completed_by',
    ];

    protected function casts(): array {
        return [
            'is_completed' => 'boolean',
        ];
    }

    public function todoList(): BelongsTo {
        return $this->belongsTo(TodoList::class);
    }

    public function completedBy(): BelongsTo {
        return $this->belongsTo(User::class, 'completed_by');
    }
}
