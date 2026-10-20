<?php

namespace Database\Seeders;

use App\Models\CustomizeOrder;
use App\Models\PickupOrder;
use App\Models\PickupOrderItem;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database with core users, menu orders, and customizations.
     */
    public function run(): void
    {
        // 1. Seed Demo Staff / Admin User
        User::firstOrCreate(
            ['email' => 'barista@whiskandbrew.com'],
            [
                'name' => 'Whisk & Brew Lead Barista',
                'password' => bcrypt('password123'),
                'email_verified_at' => now(),
            ]
        );

        // 2. Seed Sample Pickup Orders
        $order1 = PickupOrder::create([
            'reference' => (string) Str::uuid(),
            'customer_name' => 'Elena Rostova',
            'email' => 'elena@example.com',
            'pickup_in_minutes' => 20,
            'subtotal' => 530,
            'currency' => 'PHP',
            'status' => 'pending',
        ]);

        PickupOrderItem::create([
            'pickup_order_id' => $order1->id,
            'menu_item_id' => 1,
            'item_name' => 'Uji Usucha',
            'quantity' => 2,
            'unit_price' => 265,
            'line_total' => 530,
            'customization' => [
                'temperature' => 'Iced',
                'milk' => 'Barista Oat Milk',
                'sweetness' => '50%',
                'upgrade' => 'Ceremonial Uji Grade Upgrade',
            ],
        ]);

        $order2 = PickupOrder::create([
            'reference' => (string) Str::uuid(),
            'customer_name' => 'Marcus Vance',
            'email' => 'marcus@example.com',
            'pickup_in_minutes' => 15,
            'subtotal' => 320,
            'currency' => 'PHP',
            'status' => 'preparing',
        ]);

        PickupOrderItem::create([
            'pickup_order_id' => $order2->id,
            'menu_item_id' => 3,
            'item_name' => 'Kyoto Cold Brew',
            'quantity' => 1,
            'unit_price' => 320,
            'line_total' => 320,
            'customization' => [
                'temperature' => 'Iced',
                'milk' => 'Whole Dairy',
                'sweetness' => '0%',
                'upgrade' => 'None',
            ],
        ]);

        // 3. Seed Sample Customize Orders
        CustomizeOrder::create([
            'quantity' => 1,
            'pickup_in_minutes' => 10,
            'temperature' => 'Hot',
            'sweetness' => '50%',
        ]);

        CustomizeOrder::create([
            'quantity' => 2,
            'pickup_in_minutes' => 25,
            'temperature' => 'Iced',
            'sweetness' => '100%',
        ]);
    }
}
