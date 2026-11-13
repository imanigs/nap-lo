<?php

namespace App\Http\Controllers;

use App\Enums\Stable\StableAbility;
use App\Http\Resources\TodoListResource;
use App\Models\Stable;
use App\Models\TodoList;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TodoListController extends Controller {
    public function index(Request $request) {
        $user = $request->user();

        $stables = $user->allStables()
            ->filter(fn ($stable) => $stable->allows($user, StableAbility::VIEW_TODO))
            ->load('todoLists.items.completedBy');

        return Inertia::render('todo', [
            'stables' => $stables->values()->map(fn ($stable) => [
                'id' => $stable->id,
                'name' => $stable->name,
                'todoLists' => TodoListResource::collection($stable->todoLists),
                'canEdit' => $stable->allows($user, StableAbility::EDIT_TODO),
            ]),
        ]);
    }

    public function store(Request $request, Stable $stable) {
        $todoList = $stable->todoLists()->make($request->validate([
            'title' => ['required', 'string', 'max:32'],
        ]));
        $todoList->user_id = $request->user()->id;
        $todoList->save();

        return Inertia::flash('status', 'Lista létrehozva!')->back();
    }

    public function update(Request $request, Stable $stable, TodoList $todoList) {
        $todoList->update($request->validate(['title' => ['required', 'string', 'max:32']]));

        return Inertia::flash('status', 'Lista átnevezve!')->back();
    }

    public function destroy(Stable $stable, TodoList $todoList) {
        $todoList->delete();

        return Inertia::flash('status', 'Lista törölve!')->back();
    }
}
