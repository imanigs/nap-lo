<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('horse_user', function (Blueprint $table) {
            $table->id();
            $table->foreignId('horse_id')->constrained('horses', 'id')->cascadeOnDelete();
            $table->foreignId('user_id')->index()->constrained('users', 'id')->cascadeOnDelete();
            $table->string('horse_role', 32);
            $table->foreignId('giver_id')->nullable()->constrained('users', 'id')->nullOnDelete();
            $table->timestamps();

            $table->unique(['horse_id', 'user_id']);
        });
    }

    public function down(): void {
        Schema::dropIfExists('horse_user');
    }
};
