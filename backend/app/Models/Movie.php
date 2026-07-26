<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Facades\Storage;

class Movie extends Model
{
    protected $fillable = [
        'title',
        'duration',
        'description',
        'country',
        'poster_path',
    ];

    public function seances(): HasMany
    {
        return $this->hasMany(Seance::class);
    }

    public function posterUrl(): ?string
    {
        if (! $this->poster_path) {
            return null;
        }

        return Storage::disk('public')->url($this->poster_path);
    }
}
