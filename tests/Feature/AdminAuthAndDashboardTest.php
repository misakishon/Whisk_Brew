<?php

namespace Tests\Feature;

use App\Models\PickupOrder;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Str;
use Tests\TestCase;

class AdminAuthAndDashboardTest extends TestCase
{
    use RefreshDatabase;

    public function test_unauthenticated_user_cannot_access_admin_dashboard(): void
    {
        $response = $this->get('/admin');

        $response->assertRedirect('/login');
    }

    public function test_staff_url_redirects_to_admin(): void
    {
        $response = $this->get('/staff');

        $response->assertRedirect('/admin');
    }

    public function test_staff_portal_url_redirects_to_admin(): void
    {
        $response = $this->get('/staff-portal');

        $response->assertRedirect('/admin');
    }

    public function test_login_screen_can_be_rendered(): void
    {
        $response = $this->get('/login');

        $response->assertOk()
            ->assertInertia(fn ($page) => $page->component('Auth/Login'));
    }

    public function test_user_cannot_authenticate_with_invalid_credentials(): void
    {
        $user = User::factory()->create([
            'email' => 'barista@whiskandbrew.com',
            'password' => bcrypt('password123'),
        ]);

        $response = $this->post('/login', [
            'email' => 'barista@whiskandbrew.com',
            'password' => 'wrong-password',
        ]);

        $response->assertSessionHasErrors('email');
        $this->assertGuest();
    }

    public function test_user_can_authenticate_using_valid_credentials(): void
    {
        $user = User::factory()->create([
            'email' => 'barista@whiskandbrew.com',
            'password' => bcrypt('password123'),
        ]);

        $response = $this->post('/login', [
            'email' => 'barista@whiskandbrew.com',
            'password' => 'password123',
        ]);

        $this->assertAuthenticated();
        $response->assertRedirect('/admin');
    }

    public function test_authenticated_admin_can_view_dashboard_with_orders_and_stats(): void
    {
        $user = User::factory()->create();

        $order = PickupOrder::create([
            'reference' => (string) Str::uuid(),
            'customer_name' => 'Sarah Barista Fan',
            'email' => 'sarah@example.com',
            'pickup_in_minutes' => 20,
            'subtotal' => 380,
            'currency' => 'PHP',
            'status' => 'pending',
        ]);

        $response = $this->actingAs($user)->get('/admin');

        $response->assertOk()
            ->assertInertia(fn ($page) => $page
                ->component('Admin/Dashboard')
                ->has('pickupOrders', 1)
                ->where('pickupOrders.0.customer_name', 'Sarah Barista Fan')
                ->where('stats.pending_count', 1)
                ->where('stats.total_revenue', 380)
            );
    }

    public function test_admin_can_update_pickup_order_status(): void
    {
        $user = User::factory()->create();

        $order = PickupOrder::create([
            'reference' => (string) Str::uuid(),
            'customer_name' => 'John Tea Lover',
            'email' => 'john@example.com',
            'pickup_in_minutes' => 15,
            'subtotal' => 200,
            'currency' => 'PHP',
            'status' => 'pending',
        ]);

        $response = $this->actingAs($user)
            ->patch("/admin/orders/{$order->id}/status", [
                'status' => 'preparing',
            ]);

        $response->assertRedirect();
        $this->assertDatabaseHas('pickup_orders', [
            'id' => $order->id,
            'status' => 'preparing',
        ]);
    }

    public function test_admin_can_delete_pickup_order(): void
    {
        $user = User::factory()->create();

        $order = PickupOrder::create([
            'reference' => (string) Str::uuid(),
            'customer_name' => 'To Delete',
            'email' => 'delete@example.com',
            'pickup_in_minutes' => 10,
            'subtotal' => 150,
            'currency' => 'PHP',
            'status' => 'cancelled',
        ]);

        $response = $this->actingAs($user)
            ->delete("/admin/orders/{$order->id}");

        $response->assertRedirect();
        $this->assertDatabaseMissing('pickup_orders', [
            'id' => $order->id,
        ]);
    }

    public function test_admin_can_logout(): void
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)->post('/logout');

        $this->assertGuest();
        $response->assertRedirect('/login');
    }
}
