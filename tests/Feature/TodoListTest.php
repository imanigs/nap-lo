<?php

use App\Models\TodoList;
use App\Models\User;

test("stranger can't see the lists", function () {
    User::factory()->create()->ownStable()->todoLists()->create(['title' => 'teszt']);

    $this->actingAs(User::factory()->create())->get(route('todo'))
        ->assertInertia(fn ($page) => $page->has('stables', 1)->has('stables.0.todoLists', 0));
});

test("caretaker can see the lists but can't add one", function () {
    $caretaker = User::factory()->create();
    $stable = User::factory()->create()->ownStable();
    $stable->users()->attach($caretaker, ['stable_role' => 'caretaker']);

    $this->actingAs($caretaker)->get(route('todo'))
        ->assertInertia(fn ($page) => $page
            ->has('stables', 2)
            ->where('stables.1.id', $stable->id)
            ->where('stables.1.canEdit', false));
    $this->actingAs($caretaker)
        ->post(route('stables.todo-lists.store', $stable), ['title' => 'teszt'])
        ->assertForbidden();

    expect(TodoList::count())->toBe(0);
});

test("stable viewer doesn't see the lists", function () {
    $viewer = User::factory()->create();
    $stable = User::factory()->create()->ownStable();
    $stable->users()->attach($viewer, ['stable_role' => 'viewer']);
    $list = $stable->todoLists()->create(['title' => 'teszt']);
    $item = $list->items()->create(['title' => 'teszt']);

    $this->actingAs($viewer)
        ->get(route('todo'))
        ->assertInertia(fn ($page) => $page->has('stables', 1));
    $this->actingAs($viewer)
        ->put(route('stables.todo-lists.items.complete', [$stable, $list, $item]), [
            'is_completed' => true,
        ])
        ->assertForbidden();
});
