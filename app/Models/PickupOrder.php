<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class PickupOrder extends Model
{
    protected $fillable = [
        'reference',
        'customer_name',
        'email',
        'pickup_in_minutes',
        'subtotal',
        'currency',
        'status',
    ];

    public function items(): HasMany
    {
        return $this->hasMany(PickupOrderItem::class);
    }
}
