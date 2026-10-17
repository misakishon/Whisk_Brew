<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('pickup_orders', function (Blueprint $table) {
            $table->id();
            $table->uuid('reference')->unique();
            $table->string('customer_name', 120);
            $table->string('email');
            $table->unsignedSmallInteger('pickup_in_minutes');
            $table->unsignedInteger('subtotal');
            $table->char('currency', 3)->default('PHP');
            $table->string('status', 32)->default('pending');
            $table->timestamps();
        });

        Schema::create('pickup_order_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('pickup_order_id')
                ->constrained('pickup_orders')
                ->cascadeOnDelete();
            $table->unsignedBigInteger('menu_item_id');
            $table->string('item_name');
            $table->unsignedSmallInteger('quantity');
            $table->unsignedInteger('unit_price');
            $table->unsignedInteger('line_total');
            $table->json('customization')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('pickup_order_items');
        Schema::dropIfExists('pickup_orders');
    }
};
