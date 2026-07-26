<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class HallPrice extends Model
{
    protected $fillable = [
        'hall_id',
        'seat_type',
        'price',
    ];

    public function hall(): BelongsTo
    {
        return $this->belongsTo(Hall::class);
    }
}
