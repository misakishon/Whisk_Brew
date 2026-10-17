<?php

namespace Tests\Feature;

use App\Models\PickupOrder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PickupOrderTest extends TestCase
{
    use RefreshDatabase;

    public function test_menu_uses_the_current_catalog(): void
    {
        $this->get('/menu')
            ->assertOk()
            ->assertInertia(fn ($page) => $page
                ->component('Menu')
                ->where('menuItems.0.name', 'Uji Usucha')
                ->where('menuItems.12.name', 'Hojicha Basque Burnt Cheesecake'));
    }

    public function test_pickup_order_persists_server_calculated_prices(): void
    {
        $response = $this->post('/orders', [
            'customer_name' => 'Avery Customer',
            'email' => 'avery@example.com',
            'pickup_in_minutes' => 20,
            'items' => [
                [
                    'menu_item_id' => 1,
                    'quantity' => 2,
                    'price' => 1,
                    'customization' => [
                        'temperature' => 'Iced',
                        'milk' => 'Barista Oat Milk',
                        'sweetness' => '50%',
                        'upgrade' => 'Ceremonial Uji Grade Upgrade',
                    ],
                ],
            ],
        ]);

        $order = PickupOrder::with('items')->firstOrFail();

        $response->assertRedirect(route('menu'));
        $this->assertSame(530, $order->subtotal);
        $this->assertSame('PHP', $order->currency);
        $this->assertSame('pending', $order->status);
        $this->assertSame(265, $order->items->first()->unit_price);
        $this->assertSame(530, $order->items->first()->line_total);
        $this->assertSame('Uji Usucha', $order->items->first()->item_name);
    }

    public function test_unavailable_addons_cannot_be_ordered(): void
    {
        $this->postJson('/orders', [
            'customer_name' => 'Avery Customer',
            'email' => 'avery@example.com',
            'pickup_in_minutes' => 20,
            'items' => [
                [
                    'menu_item_id' => 1,
                    'quantity' => 1,
                    'customization' => [
                        'temperature' => 'Hot',
                        'milk' => 'Whole Dairy',
                        'sweetness' => '100%',
                        'upgrade' => 'Extra Single-Origin Shot',
                    ],
                ],
            ],
        ])
            ->assertUnprocessable()
            ->assertJsonValidationErrors('items.0.customization.upgrade');

        $this->assertDatabaseCount('pickup_orders', 0);
    }
}
