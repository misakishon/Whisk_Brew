<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('customize_order', function (Blueprint $table) {
            $table->id();
            $table->integer('quantity');
            $table->unsignedInteger('pickup_in_minutes');
            $table->enum('temperature', ['Hot', 'Iced'])->default('Hot');
            $table->enum('sweetness', ['0%', '50%', '100%'])->default('100%');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('customize_order');
    }
};