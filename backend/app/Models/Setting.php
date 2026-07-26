<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Setting extends Model
{
    protected $fillable = [
        'sales_open',
    ];

    protected function casts(): array
    {
        return [
            'sales_open' => 'boolean',
        ];
    }

    public static function current(): self
    {
        return static::query()->firstOrCreate([], ['sales_open' => false]);
    }
}
