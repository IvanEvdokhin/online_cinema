<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreSeanceRequest;
use App\Http\Requests\Admin\UpdateSeanceRequest;
use App\Models\Movie;
use App\Models\Seance;
use App\Services\SeanceOverlapService;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class SeanceController extends Controller
{
    public function __construct(private readonly SeanceOverlapService $overlapService)
    {
    }

    public function index(Request $request): JsonResponse
    {
        $date = Carbon::parse($request->query('date', now()->toDateString()))->startOfDay();

        $seances = Seance::query()
            ->with(['movie', 'hall'])
            ->whereDate('start_datetime', $date)
            ->orderBy('start_datetime')
            ->get()
            ->map(fn (Seance $seance) => $this->transform($seance));

        return response()->json(['data' => $seances]);
    }

    public function timeline(Request $request): JsonResponse
    {
        $date = Carbon::parse($request->query('date', now()->toDateString()))->startOfDay();

        $seances = Seance::query()
            ->with(['movie', 'hall'])
            ->whereDate('start_datetime', $date)
            ->orderBy('start_datetime')
            ->get()
            ->groupBy('hall_id')
            ->map(function ($group) {
                $hall = $group->first()->hall;

                return [
                    'hall_id' => $hall->id,
                    'hall_name' => $hall->name,
                    'seances' => $group->map(fn (Seance $seance) => [
                        'id' => $seance->id,
                        'movie_id' => $seance->movie_id,
                        'movie_title' => $seance->movie->title,
                        'duration' => $seance->movie->duration,
                        'start_time' => $seance->start_datetime->format('H:i'),
                        'start_minutes' => $seance->start_datetime->hour * 60 + $seance->start_datetime->minute,
                    ])->values(),
                ];
            })
            ->values();

        return response()->json(['data' => $seances]);
    }

    public function store(StoreSeanceRequest $request): JsonResponse
    {
        $movie = Movie::query()->findOrFail($request->validated('movie_id'));
        $start = Carbon::parse($request->validated('start_datetime'));

        $this->overlapService->assertNoOverlap(
            $request->validated('hall_id'),
            $start,
            $movie->duration,
        );

        $seance = Seance::query()->create($request->validated());

        return response()->json(['data' => $this->transform($seance->load(['movie', 'hall']))], 201);
    }

    public function update(UpdateSeanceRequest $request, Seance $seance): JsonResponse
    {
        $movie = Movie::query()->findOrFail($request->validated('movie_id'));
        $start = Carbon::parse($request->validated('start_datetime'));

        $this->overlapService->assertNoOverlap(
            $request->validated('hall_id'),
            $start,
            $movie->duration,
            $seance->id,
        );

        $seance->update($request->validated());

        return response()->json(['data' => $this->transform($seance->fresh(['movie', 'hall']))]);
    }

    public function destroy(Seance $seance): JsonResponse
    {
        $seance->delete();

        return response()->json(['message' => 'Seance deleted']);
    }

    private function transform(Seance $seance): array
    {
        return [
            'id' => $seance->id,
            'hall_id' => $seance->hall_id,
            'hall_name' => $seance->hall->name,
            'movie_id' => $seance->movie_id,
            'movie_title' => $seance->movie->title,
            'duration' => $seance->movie->duration,
            'start_datetime' => $seance->start_datetime->toIso8601String(),
            'start_time' => $seance->start_datetime->format('H:i'),
            'date' => $seance->start_datetime->toDateString(),
        ];
    }
}
