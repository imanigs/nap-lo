<?php

namespace App\Http\Controllers;

use App\Http\Resources\StableResource;
use App\Models\Stable;
use Illuminate\Http\Request;
use Inertia\Inertia;

class StableController extends Controller {
    public function edit(Stable $stable) {
        return Inertia::render('stables/edit', [
            'stable' => StableResource::make($stable),
        ]);
    }

    public function update(Request $request, Stable $stable) {
        $stable->update($request->validate(['name' => ['required', 'string', 'max:64']]));

        Inertia::flash('status', 'Istálló adatai frissítve!');

        return redirect()->route('stables.edit', $stable->id);
    }
}
