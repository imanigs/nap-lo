<?php

namespace App\Http\Controllers;

use App\Actions\Horse\SaveHorsePictureAction;
use App\Enums\Exercise\ExerciseCategory;
use App\Enums\Exercise\ExerciseIntensity;
use App\Enums\Feed\FeedCategory;
use App\Enums\Feed\FeedUnit;
use App\Enums\Health\HealthCategory;
use App\Enums\Health\HealthRepeatUnit;
use App\Enums\Horse\Gender;
use App\Enums\Horse\HorseAbility;
use App\Enums\LogKind;
use App\Enums\Observation\BodyConditionScore;
use App\Enums\Observation\DispositionRating;
use App\Enums\Observation\HealthRating;
use App\Enums\Observation\PerformanceRating;
use App\Http\Requests\Horse\StoreHorseRequest;
use App\Http\Requests\Horse\UpdateHorseRequest;
use App\Http\Resources\ExerciseResource;
use App\Http\Resources\FeedRoutineResource;
use App\Http\Resources\HealthRecordResource;
use App\Http\Resources\HorseResource;
use App\Http\Resources\MeasurementResource;
use App\Http\Resources\ObservationResource;
use App\Http\Resources\StableResource;
use App\Models\Horse;
use App\Models\Measurement;
use App\Models\Stable;
use App\Services\HorseHistoryService;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class HorseController extends Controller {
    public function index(Request $request) {
        $user = $request->user();

        $ownStable = $user->ownStable()->load('horses');
        $sharedStables = $user->sharedStables()->with('horses')->get();

        $sharedHorseIds = $user->sharedHorses()
            ->whereNotIn('stable_id', $user->allStables()->modelKeys())
            ->pluck('horses.id');

        $stablesOfSharedHorses = Stable::whereHas(
            'horses',
            fn ($query) => $query->whereIn('horses.id', $sharedHorseIds),
        )
            ->with(['horses' => fn ($query) => $query->whereIn('horses.id', $sharedHorseIds)])
            ->get();

        return Inertia::render('horses/index', [
            'stable' => StableResource::make($ownStable),
            'sharedStables' => StableResource::collection($sharedStables),
            'shared' => StableResource::collection($stablesOfSharedHorses),
        ]);
    }

    public function create() {
        return Inertia::render('horses/create', [
            'genders' => Gender::options(),
        ]);
    }

    public function store(StoreHorseRequest $request, SaveHorsePictureAction $savePicture) {
        $validated = $request->validated();

        $stable = $request->user()->ownStable();
        $picture = $request->file('picture');
        unset($validated['picture']);

        $horse = new Horse($validated);
        $horse->owner_id = $request->user()->id;
        $stable->horses()->save($horse);

        if ($picture) {
            $horse->update(['picture' => $savePicture->execute($horse, $picture)]);
        }

        Inertia::flash('status', 'Ló sikeresen hozzáadva!');

        return redirect()->route('horses.index');
    }

    public function show(Request $request, Horse $horse) {
        $filters = $request->validate(['month' => ['nullable', 'date_format:Y-m']]);
        $user = $request->user();

        $month = now()->format('Y-m');

        if (isset($filters['month'])) {
            $month = $filters['month'];
        }

        $monthStart = Carbon::createFromFormat('Y-m-d', $month.'-01')->startOfDay();
        $monthEnd = $monthStart->copy()->endOfMonth();

        $feedRoutines = [];
        if ($horse->allows($user, HorseAbility::VIEW_FEED)) {
            $routines = $horse->feedRoutines()
                ->orderByDesc('starts_at')
                ->orderByDesc('id')
                ->get();
            $feedRoutines = FeedRoutineResource::collection($routines);
        }

        $exercises = [];
        if ($horse->allows($user, HorseAbility::VIEW_EXERCISE)) {
            $exercisesOfMonth = $horse->exercises()
                ->whereBetween('date', [$monthStart, $monthEnd])
                ->orderBy('date')
                ->orderBy('time')
                ->get();
            $exercises = ExerciseResource::collection($exercisesOfMonth);
        }

        $healthRecords = [];
        if ($horse->allows($user, HorseAbility::VIEW_HEALTH)) {
            $onlyMyReminders = fn ($query) => $query->where('user_id', $user->id);
            $records = $horse->healthRecords()
                ->with(['reminders' => $onlyMyReminders])
                ->orderBy('date')
                ->orderBy('id')
                ->get();
            $healthRecords = HealthRecordResource::collection($records);
        }

        $observations = [];
        if ($horse->allows($user, HorseAbility::VIEW_OBSERVATION)) {
            $rows = $horse->observations()
                ->orderByDesc('date')
                ->orderByDesc('id')
                ->get();
            $observations = ObservationResource::collection($rows);
        }

        $measurement = $horse->measurement;

        if (! $measurement) {
            $measurement = new Measurement;
        }

        return Inertia::render('horses/show', [
            'horse' => HorseResource::make($horse),
            'abilities' => $horse->abilitiesFor($user),
            'measurement' => MeasurementResource::make($measurement),
            'feedRoutines' => $feedRoutines,
            'feedCategories' => FeedCategory::options(),
            'feedUnits' => FeedUnit::options(),
            'exerciseMonth' => $month,
            'exercises' => $exercises,
            'exerciseCategories' => ExerciseCategory::options(),
            'exerciseIntensities' => ExerciseIntensity::options(),
            'healthRecords' => $healthRecords,
            'healthCategories' => HealthCategory::options(),
            'healthRepeatUnits' => HealthRepeatUnit::options(),
            'observations' => $observations,
            'observationRatings' => [
                'health_rating' => HealthRating::options(),
                'disposition_rating' => DispositionRating::options(),
                'performance_rating' => PerformanceRating::options(),
                'bcs_rating' => BodyConditionScore::options(),
            ],
        ]);
    }

    public function history(Request $request, Horse $horse, HorseHistoryService $horseHistoryService) {
        $filters = $request->validate([
            'from' => ['nullable', 'date_format:Y-m-d'],
            'to' => ['nullable', 'date_format:Y-m-d', 'after_or_equal:from'],
            'kinds' => ['nullable', 'array'],
            'kinds.*' => [Rule::enum(LogKind::class)],
        ]);

        return Inertia::render('horses/history', [
            'horse' => HorseResource::make($horse),
            'abilities' => $horse->abilitiesFor($request->user()),
            'history' => $horseHistoryService->for($horse, $request->user(), $filters),
        ]);
    }

    public function edit(Request $request, Horse $horse) {
        return Inertia::render('horses/edit', [
            'horse' => HorseResource::make($horse),
            'gender' => $horse->gender->value,
            'genders' => Gender::options(),
            'abilities' => $horse->abilitiesFor($request->user()),
        ]);
    }

    public function settings(Request $request, Horse $horse) {
        return Inertia::render('horses/settings', [
            'horse' => HorseResource::make($horse),
            'abilities' => $horse->abilitiesFor($request->user()),
        ]);
    }

    public function update(UpdateHorseRequest $request, Horse $horse, SaveHorsePictureAction $savePicture) {
        $validated = $request->validated();

        if ($request->boolean('remove_picture')) {
            $savePicture->delete($horse);
            $validated['picture'] = null;
        } elseif ($request->hasFile('picture')) {
            $validated['picture'] = $savePicture->execute($horse, $request->file('picture'));
        } else {
            unset($validated['picture']);
        }

        $horse->update($validated);

        Inertia::flash('status', 'Ló adatai frissítve!');

        return redirect()->route('horses.show', $horse->id);
    }

    public function destroy(Horse $horse) {
        $horse->delete();

        Inertia::flash('status', 'Ló törölve!');

        return redirect()->route('horses.index');
    }
}
