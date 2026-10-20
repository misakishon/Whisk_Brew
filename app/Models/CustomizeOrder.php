<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CustomizeOrder extends Model
{
    protected $table = 'customize_order';

    protected $fillable = [
        'quantity',
        'pickup_in_minutes',
        'temperature',
        'sweetness',
    ];
}
