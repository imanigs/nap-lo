<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('health_records', function (Blueprint $table) {
            $table->id();
            $table->foreignId('horse_id')->constrained('horses', 'id')->cascadeOnDelete();
            $table->foreignId('user_id')->index()->nullable()
                ->constrained('users', 'id')->nullOnDelete();
            $table->string('label', 32);
            $table->string('category', 32);
            $table->boolean('done')->default(false);
            $table->date('date');
            $table->time('time')->nullable();
            $table->unsignedSmallInteger('repeat_every')->nullable();
            $table->string('repeat_unit', 16)->nullable();
            $table->string('notes', 255)->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->index(['horse_id', 'date']);
        });
    }

    public function down(): void {
        Schema::dropIfExists('health_records');
    }
};
