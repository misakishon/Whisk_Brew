<?php

namespace Database\Factories;

use App\Models\PickupOrder;
use App\Models\PickupOrderItem;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\PickupOrderItem>
 */
class PickupOrderItemFactory extends Factory
{
    protected $model = PickupOrderItem::class;

    public function definition(): array
    {
        return [
            'pickup_order_id' => PickupOrder::factory(),
            'menu_item_id' => fake()->numberBetween(1, 12),
            'item_name' => fake()->randomElement(['Uji Usucha', 'Matcha Einspanner', 'Matcha Cloud Latte', 'Kyoto Cold Brew']),
            'quantity' => fake()->numberBetween(1, 3),
            'unit_price' => 250,
            'line_total' => 250,
            'customization' => [
                'temperature' => 'Iced',
                'milk' => 'Barista Oat Milk',
                'sweetness' => '50%',
                'upgrade' => 'None',
            ],
        ];
    }
}
