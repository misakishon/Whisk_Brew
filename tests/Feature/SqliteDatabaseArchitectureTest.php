<?php

namespace Tests\Feature;

use App\Models\CustomizeOrder;
use App\Models\PickupOrder;
use App\Models\PickupOrderItem;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Tests\TestCase;

class SqliteDatabaseArchitectureTest extends TestCase
{
    use RefreshDatabase;

    public function test_sqlite_foreign_key_constraints_are_active(): void
    {
        $result = DB::select('PRAGMA foreign_keys;');
        $this->assertNotEmpty($result);
        $this->assertEquals(1, (int) $result[0]->foreign_keys);
    }

    public function test_pickup_order_cascade_deletes_child_items(): void
    {
        $order = PickupOrder::create([
            'reference' => (string) Str::uuid(),
            'customer_name' => 'Kenzo Takahashi',
            'email' => 'kenzo@example.com',
            'pickup_in_minutes' => 15,
            'subtotal' => 450,
            'currency' => 'PHP',
            'status' => 'pending',
        ]);

        $item = PickupOrderItem::create([
            'pickup_order_id' => $order->id,
            'menu_item_id' => 2,
            'item_name' => 'Ceremonial Matcha Latte',
            'quantity' => 1,
            'unit_price' => 450,
            'line_total' => 450,
            'customization' => [
                'temperature' => 'Hot',
                'milk' => 'Oat Milk',
                'sweetness' => '0%',
                'upgrade' => 'None',
            ],
        ]);

        $this->assertDatabaseHas('pickup_orders', ['id' => $order->id]);
        $this->assertDatabaseHas('pickup_order_items', ['id' => $item->id]);

        // Delete order and verify foreign key cascade
        $order->delete();

        $this->assertDatabaseMissing('pickup_orders', ['id' => $order->id]);
        $this->assertDatabaseMissing('pickup_order_items', ['id' => $item->id]);
    }

    public function test_json_customizations_cast_correctly(): void
    {
        $order = PickupOrder::create([
            'reference' => (string) Str::uuid(),
            'customer_name' => 'Sophia Lin',
            'email' => 'sophia@example.com',
            'pickup_in_minutes' => 30,
            'subtotal' => 280,
            'currency' => 'PHP',
            'status' => 'pending',
        ]);

        $customization = [
            'temperature' => 'Iced',
            'milk' => 'Barista Almond',
            'sweetness' => '50%',
            'upgrade' => 'Extra Shot',
        ];

        $item = PickupOrderItem::create([
            'pickup_order_id' => $order->id,
            'menu_item_id' => 4,
            'item_name' => 'Matcha Tonic',
            'quantity' => 1,
            'unit_price' => 280,
            'line_total' => 280,
            'customization' => $customization,
        ]);

        $retrieved = PickupOrderItem::find($item->id);
        $this->assertIsArray($retrieved->customization);
        $this->assertSame('Iced', $retrieved->customization['temperature']);
        $this->assertSame('Barista Almond', $retrieved->customization['milk']);
        $this->assertSame('50%', $retrieved->customization['sweetness']);
    }

    public function test_transaction_rolls_back_on_failure(): void
    {
        $initialOrderCount = PickupOrder::count();
        $initialItemCount = PickupOrderItem::count();

        try {
            DB::transaction(function () {
                $order = PickupOrder::create([
                    'reference' => (string) Str::uuid(),
                    'customer_name' => 'Failing Order',
                    'email' => 'fail@example.com',
                    'pickup_in_minutes' => 20,
                    'subtotal' => 100,
                    'currency' => 'PHP',
                    'status' => 'pending',
                ]);

                // Simulate intentional exception during multi-statement transaction
                throw new \RuntimeException('Simulated downstream payment / inventory failure');
            });
        } catch (\RuntimeException $e) {
            // Expected
        }

        $this->assertSame($initialOrderCount, PickupOrder::count());
        $this->assertSame($initialItemCount, PickupOrderItem::count());
    }

    public function test_customize_orders_crud_persists_in_sqlite(): void
    {
        // Create
        $response = $this->post('/customize-orders', [
            'quantity' => 3,
            'pickup_in_minutes' => 15,
            'temperature' => 'Hot',
            'sweetness' => '100%',
        ]);
        $response->assertRedirect('/customize-orders');
        $this->assertDatabaseHas('customize_order', [
            'quantity' => 3,
            'pickup_in_minutes' => 15,
            'temperature' => 'Hot',
            'sweetness' => '100%',
        ]);

        $order = CustomizeOrder::firstOrFail();

        // Update
        $this->put("/customize-orders/{$order->id}", [
            'sweetness' => '50%',
        ])->assertRedirect('/customize-orders');

        $this->assertDatabaseHas('customize_order', [
            'id' => $order->id,
            'sweetness' => '50%',
        ]);

        // Delete
        $this->delete("/customize-orders/{$order->id}")
            ->assertRedirect('/customize-orders');

        $this->assertDatabaseMissing('customize_order', [
            'id' => $order->id,
        ]);
    }
}
