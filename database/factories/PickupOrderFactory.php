<?php

namespace Database\Factories;

use App\Models\PickupOrder;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\PickupOrder>
 */
class PickupOrderFactory extends Factory
{
    protected $model = PickupOrder::class;

    public function definition(): array
    {
        return [
            'reference' => (string) Str::uuid(),
            'customer_name' => fake()->name(),
            'email' => fake()->safeEmail(),
            'pickup_in_minutes' => fake()->randomElement([10, 20, 30, 45]),
            'subtotal' => fake()->numberBetween(150, 1500),
            'currency' => 'PHP',
            'status' => fake()->randomElement(['pending', 'preparing', 'ready', 'completed']),
        ];
    }
}
