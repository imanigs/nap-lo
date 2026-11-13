<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('stables', function (Blueprint $table) {
            $table->id();
            $table->foreignId('owner_id')->unique()->constrained('users', 'id')->restrictOnDelete();
            $table->string('name', 64);
            $table->timestamps();
        });

        Schema::create('stable_user', function (Blueprint $table) {
            $table->id();
            $table->foreignId('stable_id')->constrained('stables', 'id')->cascadeOnDelete();
            $table->foreignId('user_id')->index()->constrained('users', 'id')->cascadeOnDelete();
            $table->string('stable_role', 32);
            $table->foreignId('giver_id')->nullable()->constrained('users', 'id')->nullOnDelete();
            $table->timestamps();

            $table->unique(['stable_id', 'user_id']);
        });
    }

    public function down(): void {
        Schema::dropIfExists('stable_user');
        Schema::dropIfExists('stables');
    }
};
