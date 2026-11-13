<?php

namespace App\Actions\User;

use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class DeleteAccountAction {
    public function execute(User $user): void {
        DB::transaction(function () use ($user) {
            if ($user->horses()->exists()) {
                throw ValidationException::withMessages([
                    'password' => 'A fiók nem törölhető, amíg vannak lovaid.',
                ]);
            }

            $user->horses()->onlyTrashed()->get()->each->forceDelete();

            DB::table('horse_user')->where('giver_id', $user->id)->delete();
            DB::table('stable_user')->where('giver_id', $user->id)->delete();

            $user->stable->delete();
            $user->notifications()->delete();

            DB::table('password_reset_tokens')->where('email', $user->email)->delete();
            DB::table('sessions')->where('user_id', $user->id)->delete();

            $user->delete();
        });
    }
}
