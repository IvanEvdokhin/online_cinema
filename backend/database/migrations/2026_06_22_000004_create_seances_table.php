<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('seances', function (Blueprint $table) {
            $table->id();
            $table->foreignId('hall_id')->constrained()->cascadeOnDelete();
            $table->foreignId('movie_id')->constrained()->cascadeOnDelete();
            $table->dateTime('start_datetime');
            $table->timestamps();

            $table->unique(['hall_id', 'start_datetime']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('seances');
    }
};
