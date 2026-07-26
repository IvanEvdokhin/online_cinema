<?php

namespace App\Services;

use App\Models\Seance;
use Carbon\Carbon;
use Illuminate\Validation\ValidationException;

class SeanceOverlapService
{
    public function assertNoOverlap(int $hallId, Carbon $start, int $durationMinutes, ?int $ignoreSeanceId = null): void
    {
        $end = $start->copy()->addMinutes($durationMinutes);

        $query = Seance::query()
            ->with('movie')
            ->where('hall_id', $hallId);

        if ($ignoreSeanceId) {
            $query->where('id', '!=', $ignoreSeanceId);
        }

        $query->whereBetween('start_datetime', [
            $start->copy()->subDay(),
            $end->copy()->addDay(),
        ]);

        foreach ($query->get() as $existing) {
            $existingStart = $existing->start_datetime;
            $existingEnd = $existing->endDatetime();

            if ($start->lt($existingEnd) && $end->gt($existingStart)) {
                throw ValidationException::withMessages([
                    'start_datetime' => ['Сеанс пересекается с другим сеансом в этом зале.'],
                ]);
            }
        }
    }
}
