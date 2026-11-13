<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('reminders', function (Blueprint $table) {
            $table->id();
            $table->foreignId('health_record_id')
                ->constrained('health_records', 'id')->cascadeOnDelete();
            $table->foreignId('user_id')->index()->constrained('users', 'id')->cascadeOnDelete();
            $table->unsignedSmallInteger('days_before');
            $table->dateTime('notified_for')->nullable();
            $table->timestamps();
            $table->unique(['health_record_id', 'user_id']);
        });
    }

    public function down(): void {
        Schema::dropIfExists('reminders');
    }
};
