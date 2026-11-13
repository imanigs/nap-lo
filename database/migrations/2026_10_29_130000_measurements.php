<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('measurements', function (Blueprint $table) {
            $table->id();
            $table->foreignId('horse_id')->unique()->constrained('horses', 'id')->cascadeOnDelete();
            $table->string('girth_size', 32)->nullable();
            $table->string('bit_size', 32)->nullable();
            $table->string('blanket_size', 32)->nullable();
            $table->string('bridle_size', 32)->nullable();
            $table->string('saddle_size', 32)->nullable();
            $table->string('feet_size', 32)->nullable();
            $table->timestamps();
            $table->softDeletes();
        });
    }

    public function down(): void {
        Schema::dropIfExists('measurements');
    }
};
