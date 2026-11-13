<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('observations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('horse_id')->constrained('horses', 'id')->cascadeOnDelete();
            $table->foreignId('user_id')->index()->nullable()
                ->constrained('users', 'id')->nullOnDelete();
            $table->date('date');
            $table->unsignedSmallInteger('height_cm')->nullable();
            $table->unsignedSmallInteger('weight_kg')->nullable();
            $table->unsignedTinyInteger('health_rating')->nullable();
            $table->unsignedTinyInteger('disposition_rating')->nullable();
            $table->unsignedTinyInteger('performance_rating')->nullable();
            $table->unsignedTinyInteger('bcs_rating')->nullable();
            $table->string('notes', 255)->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->index(['horse_id', 'date']);
        });
    }

    public function down(): void {
        Schema::dropIfExists('observations');
    }
};
