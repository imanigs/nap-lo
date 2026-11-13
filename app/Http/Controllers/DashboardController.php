<?php

namespace App\Http\Controllers;

use App\Enums\LogKind;
use App\Enums\Stable\StableAbility;
use App\Http\Resources\LogEntryResource;
use App\Http\Resources\TodoItemResource;
use App\Models\TodoList;
use App\Services\LogEntryService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller {
    public function __invoke(Request $request, LogEntryService $logEntryService) {
        $user = $request->user();
        $today = today();

        $todaysLogs = $logEntryService->between(
            $user,
            $today->startOfDay(),
            $today->endOfDay(),
            [LogKind::Feed, LogKind::Exercise, LogKind::Health],
        );
        $overdueLogs = $logEntryService->overdue($user, $today);
        $logs = $overdueLogs->merge($todaysLogs)->values();

        $notifications = $user->unreadNotifications()->latest()->get()
            ->map(fn ($notification) => [
                'id' => $notification->id,
                'data' => $notification->data,
            ]);

        $stables = $user->allStables()
            ->filter(fn ($stable) => $stable->allows($user, StableAbility::VIEW_TODO));
        $stillTodo = fn ($query) => $query->where('is_completed', false);

        $todoLists = TodoList::whereIn('stable_id', $stables->modelKeys())
            ->whereHas('items', $stillTodo)
            ->with(['stable', 'items' => $stillTodo])
            ->orderBy('stable_id')
            ->orderBy('id')
            ->get();

        $todos = $todoLists->map(fn ($list) => [
            'id' => $list->id,
            'title' => $list->title,
            'stable' => ['id' => $list->stable->id, 'name' => $list->stable->name],
            'items' => TodoItemResource::collection($list->items),
        ]);

        return Inertia::render('dashboard', [
            'today' => $today->toDateString(),
            'notifications' => $notifications,
            'items' => LogEntryResource::collection($logs),
            'todos' => $todos,
        ]);
    }
}
