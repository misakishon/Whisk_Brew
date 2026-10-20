<?php

namespace App\Http\Controllers\Admin;

use App\Models\CustomizeOrder;
use App\Models\PickupOrder;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class AdminDashboardController
{
    /**
     * Display the Admin Kitchen & Management Dashboard.
     */
    public function index(Request $request): Response
    {
        $pickupOrders = PickupOrder::with('items')
            ->latest()
            ->get()
            ->map(function (PickupOrder $order) {
                return [
                    'id' => $order->id,
                    'reference' => $order->reference,
                    'customer_name' => $order->customer_name,
                    'email' => $order->email,
                    'pickup_in_minutes' => $order->pickup_in_minutes,
                    'subtotal' => $order->subtotal,
                    'currency' => $order->currency,
                    'status' => $order->status,
                    'created_at_formatted' => $order->created_at ? $order->created_at->format('M d, Y h:i A') : 'N/A',
                    'created_at_diff' => $order->created_at ? $order->created_at->diffForHumans() : 'Just now',
                    'estimated_ready_time' => $order->created_at ? $order->created_at->addMinutes($order->pickup_in_minutes)->format('h:i A') : 'N/A',
                    'items' => $order->items->map(function ($item) {
                        return [
                            'id' => $item->id,
                            'menu_item_id' => $item->menu_item_id,
                            'item_name' => $item->item_name,
                            'quantity' => $item->quantity,
                            'unit_price' => $item->unit_price,
                            'line_total' => $item->line_total,
                            'customization' => $item->customization,
                        ];
                    }),
                ];
            });

        $customizeOrders = CustomizeOrder::latest()
            ->get()
            ->map(function (CustomizeOrder $order) {
                return [
                    'id' => $order->id,
                    'quantity' => $order->quantity,
                    'pickup_in_minutes' => $order->pickup_in_minutes,
                    'temperature' => strtoupper($order->temperature),
                    'sweetness' => $order->sweetness,
                    'is_cold' => $order->temperature === 'Iced',
                    'created_at_formatted' => $order->created_at ? $order->created_at->diffForHumans() : 'Just now',
                ];
            });

        $stats = [
            'total_revenue' => (int) PickupOrder::where('status', '!=', 'cancelled')->sum('subtotal'),
            'total_orders' => PickupOrder::count(),
            'pending_count' => PickupOrder::where('status', 'pending')->count(),
            'preparing_count' => PickupOrder::where('status', 'preparing')->count(),
            'ready_count' => PickupOrder::where('status', 'ready')->count(),
            'completed_count' => PickupOrder::where('status', 'completed')->count(),
            'customize_orders_count' => CustomizeOrder::count(),
        ];

        return Inertia::render('Admin/Dashboard', [
            'adminUser' => [
                'name' => Auth::user()->name ?? 'Lead Barista',
                'email' => Auth::user()->email ?? 'barista@whiskandbrew.com',
            ],
            'pickupOrders' => $pickupOrders,
            'customizeOrders' => $customizeOrders,
            'stats' => $stats,
            'flash' => [
                'success' => session('success'),
            ],
        ]);
    }

    /**
     * Update order status (pending -> preparing -> ready -> completed -> cancelled).
     */
    public function updateOrderStatus(Request $request, int $id): RedirectResponse
    {
        $validated = $request->validate([
            'status' => ['required', Rule::in(['pending', 'preparing', 'ready', 'completed', 'cancelled'])],
        ]);

        $order = PickupOrder::findOrFail($id);
        $order->update([
            'status' => $validated['status'],
        ]);

        return redirect()->back()->with('success', "Order #{$order->reference} updated to {$validated['status']}.");
    }

    /**
     * Delete an order.
     */
    public function destroyOrder(int $id): RedirectResponse
    {
        $order = PickupOrder::findOrFail($id);
        $order->delete();

        return redirect()->back()->with('success', "Order removed from registry.");
    }

    /**
     * Delete a customize order.
     */
    public function destroyCustomizeOrder(int $id): RedirectResponse
    {
        $order = CustomizeOrder::findOrFail($id);
        $order->delete();

        return redirect()->back()->with('success', "Customization request cleared.");
    }
}
