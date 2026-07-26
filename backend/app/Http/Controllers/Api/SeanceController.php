<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Seance;
use App\Models\Setting;
use App\Models\Ticket;
use Illuminate\Http\JsonResponse;

class SeanceController extends Controller
{
    public function show(Seance $seance): JsonResponse
    {
        if (! Setting::current()->sales_open || ! $seance->hall->is_active) {
            return response()->json(['message' => 'Сеанс недоступен.'], 404);
        }

        $seance->load(['movie', 'hall.prices']);

        $takenSeats = Ticket::query()
            ->where('seance_id', $seance->id)
            ->get(['row', 'seat'])
            ->map(fn (Ticket $ticket) => ['row' => $ticket->row, 'seat' => $ticket->seat]);

        return response()->json([
            'data' => [
                'id' => $seance->id,
                'start_time' => $seance->start_datetime->format('H:i'),
                'date' => $seance->start_datetime->toDateString(),
                'movie' => [
                    'id' => $seance->movie->id,
                    'title' => $seance->movie->title,
                    'duration' => $seance->movie->duration,
                ],
                'hall' => [
                    'id' => $seance->hall->id,
                    'name' => $seance->hall->name,
                    'rows' => $seance->hall->rows,
                    'cols' => $seance->hall->cols,
                    'seat_layout' => $seance->hall->seat_layout,
                    'prices' => $seance->hall->prices->mapWithKeys(fn ($price) => [$price->seat_type => $price->price]),
                ],
                'taken_seats' => $takenSeats,
            ],
        ]);
    }
}
