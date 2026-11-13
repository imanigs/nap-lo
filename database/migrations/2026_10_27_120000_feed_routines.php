<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('feed_routines', function (Blueprint $table) {
            $table->id();
            $table->foreignId('horse_id')->constrained('horses', 'id')->cascadeOnDelete();
            $table->foreignId('user_id')->index()->nullable()
                ->constrained('users', 'id')->nullOnDelete();
            $table->string('label', 32);
            $table->string('category', 32);
            $table->boolean('is_ad_lib')->default(false);
            $table->decimal('quantity', 7, 2)->unsigned()->nullable();
            $table->string('unit', 32)->nullable();
            $table->json('days_of_week')->nullable();
            $table->json('times_of_day')->nullable();
            $table->date('starts_at');
            $table->date('ends_at')->nullable();
            $table->string('notes', 100)->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->index(['horse_id', 'starts_at']);
        });
    }

    public function down(): void {
        Schema::dropIfExists('feed_routines');
    }
};
