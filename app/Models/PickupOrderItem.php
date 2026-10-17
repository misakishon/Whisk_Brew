<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PickupOrderItem extends Model
{
    protected $fillable = [
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
        ];
    }

    public function order(): BelongsTo
    {
        return $this->belongsTo(PickupOrder::class, 'pickup_order_id');
    }
}
