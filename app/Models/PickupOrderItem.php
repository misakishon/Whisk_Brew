<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PickupOrderItem extends Model
{
    /** @use HasFactory<\Database\Factories\PickupOrderItemFactory> */
    use HasFactory;

    protected $fillable = [
        'pickup_order_id',
        'menu_item_id',
        'item_name',
        'quantity',
        'unit_price',
        'line_total',
        'customization',
    ];

    protected function casts(): array
    {
        return [
            'customization' => 'array',
            'quantity' => 'integer',
            'unit_price' => 'integer',
            'line_total' => 'integer',
            'menu_item_id' => 'integer',
        ];
    }

    public function order(): BelongsTo
    {
        return $this->belongsTo(PickupOrder::class, 'pickup_order_id');
    }
}
