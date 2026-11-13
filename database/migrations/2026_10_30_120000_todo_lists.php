<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('todo_lists', function (Blueprint $table) {
            $table->id();
            $table->foreignId('stable_id')->constrained()->cascadeOnDelete();
            $table->foreignId('user_id')->index()->nullable()->constrained()->nullOnDelete();
            $table->string('title', 32);
            $table->timestamps();
        });

        Schema::create('todo_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('todo_list_id')->index()->constrained()->cascadeOnDelete();
            $table->string('title', 64);
            $table->boolean('is_completed')->default(false);
            $table->foreignId('completed_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();
        });
    }

    public function down(): void {
        Schema::dropIfExists('todo_items');
        Schema::dropIfExists('todo_lists');
    }
};
