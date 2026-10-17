<?php

namespace App\Http\Controllers;

use App\Models\PickupOrder;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Str;

class PickupOrderController
{
    public function store(Request $request): RedirectResponse
    {
        $catalog = config('whisk_brew.menu');
        $milkPrices = config('whisk_brew.milk_prices');
        $upgradePrices = config('whisk_brew.upgrade_prices');

        $validator = Validator::make($request->all(), [
            'customer_name' => ['required', 'string', 'max:120'],
            'email' => ['required', 'email', 'max:255'],
            'pickup_in_minutes' => ['required', 'integer', Rule::in([10, 20, 30, 45])],
            'items' => ['required', 'array', 'min:1', 'max:20'],
            'items.*.menu_item_id' => ['required', 'integer', Rule::in(array_keys($catalog))],
            'items.*.quantity' => ['required', 'integer', 'min:1', 'max:20'],
            'items.*.customization' => ['required', 'array:temperature,milk,sweetness,upgrade'],
            'items.*.customization.temperature' => ['required', Rule::in(['Hot', 'Iced'])],
            'items.*.customization.milk' => ['required', Rule::in(array_keys($milkPrices))],
            'items.*.customization.sweetness' => ['required', Rule::in(['0%', '50%', '100%'])],
            'items.*.customization.upgrade' => ['required', Rule::in(array_keys($upgradePrices))],
        ]);

        $validator->after(function ($validator) use ($request, $catalog): void {
            $items = $request->input('items', []);
            if (! is_array($items)) {
                return;
            }

            $quantity = 0;
            foreach ($items as $index => $line) {
                if (! is_array($line)) {
                    continue;
                }

                $quantity += (int) ($line['quantity'] ?? 0);
                $menuItem = $catalog[(int) ($line['menu_item_id'] ?? 0)] ?? null;
                $customization = $line['customization'] ?? null;
                if (! $menuItem || ! $menuItem['isDrink'] || ! is_array($customization)) {
                    continue;
                }

                $upgrade = $customization['upgrade'] ?? 'None';
                if (
                    $upgrade !== 'None'
                    && ! in_array($upgrade, $menuItem['allowedUpgrades'], true)
                ) {
                    $validator->errors()->add(
                        "items.$index.customization.upgrade",
                        'That add-on is not available for this menu item.',
                    );
                }
            }

            if ($quantity > 30) {
                $validator->errors()->add('items', 'An order may contain no more than 30 items.');
            }
        });

        $validated = $validator->validate();
        $lines = [];
        $subtotal = 0;

        foreach ($validated['items'] as $line) {
            $itemId = (int) $line['menu_item_id'];
            $menuItem = $catalog[$itemId];
            $customization = $menuItem['isDrink']
                ? $line['customization']
                : null;
            $unitPrice = $menuItem['price'];

            if ($customization !== null) {
                $unitPrice += $milkPrices[$customization['milk']];
                $unitPrice += $upgradePrices[$customization['upgrade']];
                if ($customization['temperature'] === 'Iced') {
                    $unitPrice += 15;
                }
            }

            $lineTotal = $unitPrice * $line['quantity'];
            $subtotal += $lineTotal;
            $lines[] = [
                'menu_item_id' => $itemId,
                'item_name' => $menuItem['name'],
                'quantity' => $line['quantity'],
                'unit_price' => $unitPrice,
                'line_total' => $lineTotal,
                'customization' => $customization,
            ];
        }

        if ($subtotal > 100000) {
            throw ValidationException::withMessages([
                'items' => 'The order total exceeds the allowed limit.',
            ]);
        }

        $order = DB::transaction(function () use ($validated, $lines, $subtotal): PickupOrder {
            $order = PickupOrder::create([
                'reference' => (string) Str::uuid(),
                'customer_name' => $validated['customer_name'],
                'email' => $validated['email'],
                'pickup_in_minutes' => $validated['pickup_in_minutes'],
                'subtotal' => $subtotal,
                'currency' => 'PHP',
                'status' => 'pending',
            ]);

            $order->items()->createMany($lines);

            return $order;
        });

        return redirect()
            ->route('menu')
            ->with('order_confirmation', [
                'reference' => $order->reference,
                'total' => $order->subtotal,
            ]);
    }
}
