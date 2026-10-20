<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class PickupOrder extends Model
{
    /** @use HasFactory<\Database\Factories\PickupOrderFactory> */
    use HasFactory;

    protected $fillable = [
        'reference',
        'customer_name',
        'email',
        'pickup_in_minutes',
        'subtotal',
        'currency',
        'status',
    ];

    protected function casts(): array
    {
        return [
            'subtotal' => 'integer',
            'pickup_in_minutes' => 'integer',
        ];
    }

    public function items(): HasMany
    {
        return $this->hasMany(PickupOrderItem::class);
    }

    public function scopePending(Builder $query): Builder
    {
        return $query->where('status', 'pending');
    }

    public function scopeRecent(Builder $query): Builder
    {
        return $query->latest();
    }
}
