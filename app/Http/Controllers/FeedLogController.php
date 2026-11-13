<?php

namespace App\Http\Controllers;

use App\Http\Requests\Feed\FeedLogRequest;
use App\Models\FeedRoutine;
use App\Models\Horse;

class FeedLogController extends Controller {
    public function store(FeedLogRequest $request, Horse $horse, FeedRoutine $feedRoutine) {
        $feedRoutine->completeLogEntry($request->logEntry());

        return back();
    }

    public function destroy(FeedLogRequest $request, Horse $horse, FeedRoutine $feedRoutine) {
        $feedRoutine->undoLogEntry($request->logEntry());

        return back();
    }
}
