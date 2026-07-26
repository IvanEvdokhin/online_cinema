<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Hall extends Model
{
    protected $fillable = [
        'name',
        'rows',
        'cols',
        'seat_layout',
        'is_active',
    ];

    protected function casts(): array
    {
        return [
            'seat_layout' => 'array',
            'is_active' => 'boolean',
        ];
    }

    public function prices(): HasMany
    {
        return $this->hasMany(HallPrice::class);
    }

    public function seances(): HasMany
    {
        return $this->hasMany(Seance::class);
    }

    public function priceFor(string $seatType): int
    {
        return (int) ($this->prices->firstWhere('seat_type', $seatType)?->price ?? 0);
    }

    public function seatTypeAt(int $row, int $seat): ?string
    {
        $layout = $this->seat_layout ?? [];
        $type = $layout[$row][$seat] ?? null;

        return in_array($type, ['standard', 'vip'], true) ? $type : null;
    }
}
