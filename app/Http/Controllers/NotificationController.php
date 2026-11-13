<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class NotificationController extends Controller {
    public function read(Request $request, string $id) {
        $request->user()->notifications()->findOrFail($id)->markAsRead();

        return back();
    }

    public function readAll(Request $request) {
        $request->user()->unreadNotifications()->update(['read_at' => now()]);

        return back();
    }
}
