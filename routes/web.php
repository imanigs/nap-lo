<?php

use App\Http\Controllers\Auth\EmailConfirmationController;
use App\Http\Controllers\Auth\EmailVerifyController;
use App\Http\Controllers\Auth\LoginController;
use App\Http\Controllers\Auth\NewPasswordController;
use App\Http\Controllers\Auth\PasswordResetLinkController;
use App\Http\Controllers\Auth\RegistrationController;
use App\Http\Controllers\Auth\UserSettingsController;
use App\Http\Controllers\CalendarController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\ExerciseController;
use App\Http\Controllers\FeedLogController;
use App\Http\Controllers\FeedRoutineController;
use App\Http\Controllers\HealthRecordController;
use App\Http\Controllers\HorseController;
use App\Http\Controllers\HorsePictureController;
use App\Http\Controllers\HorseShareController;
use App\Http\Controllers\MeasurementController;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\ObservationController;
use App\Http\Controllers\ReminderController;
use App\Http\Controllers\ShareSettingsController;
use App\Http\Controllers\StableController;
use App\Http\Controllers\StableShareController;
use App\Http\Controllers\TodoItemController;
use App\Http\Controllers\TodoListController;
use Illuminate\Support\Facades\Route;

Route::get('/', fn () => redirect()->route(auth()->check() ? 'dashboard' : 'login'))->name('home');

Route::middleware('guest')->group(function () {
    Route::get('login', [LoginController::class, 'show'])->name('login');
    Route::post('login', [LoginController::class, 'authenticate'])->middleware('throttle:6,1');

    Route::get('register', [RegistrationController::class, 'show'])->name('register');
    Route::post('register', [RegistrationController::class, 'register']);

    Route::get('/forgot-password', [PasswordResetLinkController::class, 'create'])
        ->name('password.request');

    Route::post('/forgot-password', [PasswordResetLinkController::class, 'store'])
        ->middleware('throttle:6,1')->name('password.email');

    Route::get('/reset-password/{token}', [NewPasswordController::class, 'create'])
        ->name('password.reset');

    Route::post('/reset-password', [NewPasswordController::class, 'store'])
        ->middleware('throttle:6,1')->name('password.update');
});

Route::middleware('auth')->group(function () {
    Route::post('logout', [LoginController::class, 'logout'])
        ->name('logout');

    Route::get('email/verify', [EmailConfirmationController::class, 'create'])
        ->name('verification.notice');

    Route::post('email/verify/resend', [EmailConfirmationController::class, 'store'])
        ->middleware('throttle:6,1')->name('verification.send');

    Route::get('email/verify/{id}/{hash}', EmailVerifyController::class)
        ->middleware('signed')->middleware('throttle:6,1')->name('verification.verify');

    Route::patch('/settings', [UserSettingsController::class, 'update'])->name('settings.update');

    Route::middleware('verified')->group(function () {
        Route::get('dashboard', DashboardController::class)->name('dashboard');
        Route::get('calendar', CalendarController::class)->name('calendar');

        Route::post('notifications/read-all', [NotificationController::class, 'readAll'])
            ->name('notifications.read-all');
        Route::post('notifications/{id}/read', [NotificationController::class, 'read'])
            ->whereUuid('id')
            ->name('notifications.read');

        Route::get('reminders', [ReminderController::class, 'index'])->name('reminders');
        Route::delete('reminders/{reminder}', [ReminderController::class, 'destroy'])
            ->whereNumber('reminder')
            ->name('reminders.destroy');

        Route::get('/settings', [UserSettingsController::class, 'edit'])->name('settings.edit');
        Route::put('/settings/password', [UserSettingsController::class, 'updatePassword'])
            ->middleware('throttle:6,1')
            ->name('settings.password.update');
        Route::get('/settings/shares', [ShareSettingsController::class, 'index'])
            ->name('settings.shares');
        Route::delete(
            '/settings/shares/horses/{horse}',
            [ShareSettingsController::class, 'leaveHorse'],
        )
            ->name('settings.shares.leave-horse');
        Route::delete(
            '/settings/shares/stables/{stable}',
            [ShareSettingsController::class, 'leaveStable'],
        )
            ->name('settings.shares.leave-stable');
        Route::delete('/settings', [UserSettingsController::class, 'destroy'])
            ->middleware('throttle:6,1')
            ->name('settings.destroy');

        Route::resource('horses', HorseController::class)
            ->middlewareFor(['create', 'store'], 'can:create,App\Models\Horse')
            ->middlewareFor('show', 'can:view,horse')
            ->middlewareFor(['edit', 'update'], 'can:update,horse')
            ->middlewareFor('destroy', 'can:delete,horse');

        Route::singleton('horses.measurement', MeasurementController::class)
            ->only(['edit', 'update'])
            ->middleware('can:update,horse');

        Route::get('/horses/{horse}/history', [HorseController::class, 'history'])
            ->name('horses.history')
            ->middleware('can:view,horse');

        Route::get('/horses/{horse}/settings', [HorseController::class, 'settings'])
            ->name('horses.settings')
            ->middleware('can:delete,horse');

        Route::resource('horses.shares', HorseShareController::class)
            ->only(['index', 'store', 'update', 'destroy'])
            ->parameters(['shares' => 'user'])
            ->middlewareFor('index', ['can:viewShares,horse', 'throttle:30,1'])
            ->middlewareFor('store', ['can:manageShares,horse', 'throttle:30,1'])
            ->middlewareFor(['update', 'destroy'], 'can:manageShares,horse');

        Route::resource('horses.feed-routines', FeedRoutineController::class)
            ->only(['store', 'update', 'destroy'])
            ->scoped()
            ->middlewareFor('store', 'can:create,App\Models\FeedRoutine,horse')
            ->middlewareFor('update', 'can:update,feed_routine')
            ->middlewareFor('destroy', 'can:delete,feed_routine');

        Route::post(
            '/horses/{horse}/feed-routines/{feed_routine}/close',
            [FeedRoutineController::class, 'close'],
        )
            ->scopeBindings()
            ->middleware('can:update,feed_routine')
            ->name('horses.feed-routines.close');

        Route::post(
            '/horses/{horse}/feed-routines/{feed_routine}/logs',
            [FeedLogController::class, 'store'],
        )
            ->scopeBindings()
            ->middleware('can:update,feed_routine')
            ->name('horses.feed-routines.logs.store');

        Route::delete(
            '/horses/{horse}/feed-routines/{feed_routine}/logs',
            [FeedLogController::class, 'destroy'],
        )
            ->scopeBindings()
            ->middleware('can:update,feed_routine')
            ->name('horses.feed-routines.logs.destroy');

        Route::resource('horses.exercises', ExerciseController::class)
            ->only(['store', 'update', 'destroy'])
            ->scoped()
            ->middlewareFor('store', 'can:create,App\Models\Exercise,horse')
            ->middlewareFor('update', 'can:update,exercise')
            ->middlewareFor('destroy', 'can:delete,exercise');

        Route::post(
            '/horses/{horse}/exercises/{exercise}/complete',
            [ExerciseController::class, 'complete'],
        )
            ->scopeBindings()
            ->middleware('can:update,exercise')
            ->name('horses.exercises.complete');

        Route::resource('horses.health-records', HealthRecordController::class)
            ->only(['store', 'update', 'destroy'])
            ->scoped()
            ->middlewareFor('store', 'can:create,App\Models\HealthRecord,horse')
            ->middlewareFor('update', 'can:update,health_record')
            ->middlewareFor('destroy', 'can:delete,health_record');

        Route::post(
            '/horses/{horse}/health-records/{health_record}/complete',
            [HealthRecordController::class, 'complete'],
        )
            ->scopeBindings()
            ->middleware('can:update,health_record')
            ->name('horses.health-records.complete');

        Route::resource('horses.observations', ObservationController::class)
            ->only(['store', 'update', 'destroy'])
            ->scoped()
            ->middlewareFor('store', 'can:create,App\Models\Observation,horse')
            ->middlewareFor('update', 'can:update,observation')
            ->middlewareFor('destroy', 'can:delete,observation');

        Route::resource('stables', StableController::class)
            ->only(['edit', 'update'])
            ->middlewareFor(['edit', 'update'], 'can:update,stable');

        Route::get('/todo', [TodoListController::class, 'index'])->name('todo');

        Route::resource('stables.todo-lists', TodoListController::class)
            ->only(['store', 'update', 'destroy'])
            ->scoped()
            ->middlewareFor(['store', 'update', 'destroy'], 'can:editTodo,stable');

        Route::resource('stables.todo-lists.items', TodoItemController::class)
            ->only(['store', 'destroy'])
            ->scoped()
            ->middlewareFor(['store', 'destroy'], 'can:editTodo,stable');

        Route::put(
            '/stables/{stable}/todo-lists/{todo_list}/items/{item}/completion',
            [TodoItemController::class, 'complete'],
        )
            ->scopeBindings()
            ->middleware('can:viewTodo,stable')
            ->name('stables.todo-lists.items.complete');

        Route::resource('stables.shares', StableShareController::class)
            ->only(['index', 'store', 'update', 'destroy'])
            ->parameters(['shares' => 'user'])
            ->middlewareFor('index', ['can:manageShares,stable', 'throttle:30,1'])
            ->middlewareFor('store', ['can:manageShares,stable', 'throttle:30,1'])
            ->middlewareFor(['update', 'destroy'], 'can:manageShares,stable');

        Route::get('/horses/{horse}/picture', HorsePictureController::class)
            ->name('horses.picture')
            ->middleware(['can:view,horse', 'cache.headers:private;no_cache']);
    });
});
