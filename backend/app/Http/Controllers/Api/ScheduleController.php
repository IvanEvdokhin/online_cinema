<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Movie;
use App\Models\Seance;
use App\Models\Setting;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ScheduleController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        if (! Setting::current()->sales_open) {
            return response()->json(['data' => []]);
        }

        $date = Carbon::parse($request->query('date', now()->toDateString()))->startOfDay();

        $seances = Seance::query()
            ->with(['movie', 'hall'])
            ->whereHas('hall', fn ($query) => $query->where('is_active', true))
            ->whereDate('start_datetime', $date)
            ->orderBy('start_datetime')
            ->get();

        $movies = Movie::query()
            ->whereIn('id', $seances->pluck('movie_id')->unique())
            ->orderBy('title')
            ->get()
            ->map(function (Movie $movie) use ($seances) {
                $movieSeances = $seances->where('movie_id', $movie->id);

                return [
                    'id' => $movie->id,
                    'title' => $movie->title,
                    'duration' => $movie->duration,
                    'description' => $movie->description,
                    'country' => $movie->country,
                    'poster_url' => $movie->posterUrl(),
                    'halls' => $movieSeances
                        ->groupBy('hall_id')
                        ->map(function ($group) {
                            $hall = $group->first()->hall;

                            return [
                                'hall_id' => $hall->id,
                                'hall_name' => $hall->name,
                                'seances' => $group->map(fn (Seance $seance) => [
                                    'id' => $seance->id,
                                    'start_time' => $seance->start_datetime->format('H:i'),
                                ])->values(),
                            ];
                        })
                        ->values(),
                ];
            });

        return response()->json(['data' => $movies]);
    }
}
