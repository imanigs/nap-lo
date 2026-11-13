<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('feed_logs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('feed_routine_id')
                ->constrained('feed_routines', 'id')->cascadeOnDelete();
            $table->date('date')->index();
            $table->time('time');
            $table->timestamps();
            $table->unique(['feed_routine_id', 'date', 'time']);
        });
    }

    public function down(): void {
        Schema::dropIfExists('feed_logs');
    }
};
