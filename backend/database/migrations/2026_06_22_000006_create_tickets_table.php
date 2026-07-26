<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('tickets', function (Blueprint $table) {
            $table->id();
            $table->foreignId('booking_id')->constrained()->cascadeOnDelete();
            $table->foreignId('seance_id')->constrained()->cascadeOnDelete();
            $table->unsignedSmallInteger('row');
            $table->unsignedSmallInteger('seat');
            $table->string('seat_type');
            $table->unsignedInteger('price');
            $table->timestamps();

            $table->unique(['seance_id', 'row', 'seat']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('tickets');
    }
};
