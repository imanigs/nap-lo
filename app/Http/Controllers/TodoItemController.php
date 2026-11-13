<?php

namespace App\Http\Controllers;

use App\Models\Stable;
use App\Models\TodoItem;
use App\Models\TodoList;
use Illuminate\Http\Request;

class TodoItemController extends Controller {
    public function store(Request $request, Stable $stable, TodoList $todoList) {
        $todoList->items()->create($request->validate([
            'title' => ['required', 'string', 'max:64'],
        ]));

        return back();
    }

    public function complete(Request $request, Stable $stable, TodoList $todoList, TodoItem $item) {
        $request->validate(['is_completed' => ['required', 'boolean']]);

        $item->update([
            'is_completed' => $request->boolean('is_completed'),
            'completed_by' => $request->boolean('is_completed') ? $request->user()->id : null,
        ]);

        return back();
    }

    public function destroy(Stable $stable, TodoList $todoList, TodoItem $item) {
        $item->delete();

        return back();
    }
}
