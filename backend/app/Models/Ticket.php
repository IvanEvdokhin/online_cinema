<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Ticket extends Model
{
    protected $fillable = [
        'booking_id',
        'seance_id',
        'row',
        'seat',
        'seat_type',
        'price',
    ];

    public function booking(): BelongsTo
    {
        return $this->belongsTo(Booking::class);
    }

    public function seance(): BelongsTo
    {
        return $this->belongsTo(Seance::class);
    }
}
