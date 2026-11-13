<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('horses', function (Blueprint $table) {
            $table->id();
            $table->foreignId('stable_id')->index()
                ->constrained('stables', 'id')->restrictOnDelete();
            $table->foreignId('owner_id')->index()->constrained('users', 'id')->restrictOnDelete();
            $table->string('name', 64);
            $table->string('gender', 32);
            $table->date('birth_date')->nullable();
            $table->string('status', 32)->nullable();
            $table->string('breed', 32)->nullable();
            $table->string('picture')->nullable();
            $table->text('notes')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });
    }

    public function down(): void {
        Schema::dropIfExists('horses');
    }
};
