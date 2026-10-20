<?php

namespace App\Http\Controllers;

use App\Models\CustomizeOrder;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CustomizeOrderController
{
    /**
     * Display all customize orders on the website.
     * Demonstrates calling the database and modifying/formatting the values.
     */
    public function index(Request $request)
    {
        // 1. Fetch data from the database using the Eloquent Model
        $orders = CustomizeOrder::latest()->get();

        // 2. Modify / transform the values before displaying
        $transformedOrders = $orders->map(function ($order) {
            return [
                'id' => $order->id,
                'quantity' => $order->quantity,
                'pickup_in_minutes' => $order->pickup_in_minutes,
                // Modified values:
                'temperature' => strtoupper($order->temperature),
                'sweetness' => $order->sweetness,
                'is_cold' => $order->temperature === 'Iced',
                'estimated_pickup_time' => now()->addMinutes($order->pickup_in_minutes)->format('h:i A'),
                'created_at_formatted' => $order->created_at ? $order->created_at->diffForHumans() : 'Just now',
            ];
        });

        // Return JSON if requested as API, otherwise render the Inertia website page
        if ($request->wantsJson()) {
            return response()->json($transformedOrders);
        }

        return Inertia::render('CustomizeOrders', [
            'orders' => $transformedOrders,
        ]);
    }

    /**
     * Store a newly created customize order in the database.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'quantity' => 'required|integer|min:1|max:20',
            'pickup_in_minutes' => 'required|integer|min:5|max:120',
            'temperature' => 'required|in:Hot,Iced',
            'sweetness' => 'required|in:0%,50%,100%',
        ]);

        CustomizeOrder::create($validated);

        return redirect()->route('customize-orders.index')
            ->with('success', 'Custom order created successfully!');
    }

    /**
     * Modify / update existing order values in the database.
     */
    public function update(Request $request, $id)
    {
        $order = CustomizeOrder::findOrFail($id);

        $validated = $request->validate([
            'quantity' => 'sometimes|integer|min:1|max:20',
            'pickup_in_minutes' => 'sometimes|integer|min:5|max:120',
            'temperature' => 'sometimes|in:Hot,Iced',
            'sweetness' => 'sometimes|in:0%,50%,100%',
        ]);

        // Modify the values in the database
        $order->update($validated);

        return redirect()->route('customize-orders.index')
            ->with('success', 'Order updated successfully!');
    }

    /**
     * Remove an order from the database.
     */
    public function destroy($id)
    {
        $order = CustomizeOrder::findOrFail($id);
        $order->delete();

        return redirect()->route('customize-orders.index')
            ->with('success', 'Order removed!');
    }
}
