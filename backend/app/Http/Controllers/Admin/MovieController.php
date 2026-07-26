<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreMovieRequest;
use App\Http\Requests\Admin\UpdateMovieRequest;
use App\Models\Movie;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class MovieController extends Controller
{
    public function index(): JsonResponse
    {
        $movies = Movie::query()->orderBy('title')->get()->map(fn (Movie $movie) => $this->transform($movie));

        return response()->json(['data' => $movies]);
    }

    public function store(StoreMovieRequest $request): JsonResponse
    {
        $movie = Movie::query()->create($request->validated());

        return response()->json(['data' => $this->transform($movie)], 201);
    }

    public function update(UpdateMovieRequest $request, Movie $movie): JsonResponse
    {
        $movie->update($request->validated());

        return response()->json(['data' => $this->transform($movie->fresh())]);
    }

    public function destroy(Movie $movie): JsonResponse
    {
        if ($movie->poster_path) {
            Storage::disk('public')->delete($movie->poster_path);
        }

        $movie->delete();

        return response()->json(['message' => 'Movie deleted']);
    }

    public function uploadPoster(Request $request, Movie $movie): JsonResponse
    {
        $request->validate([
            'poster' => ['required', 'image', 'max:4096'],
        ]);

        if ($movie->poster_path) {
            Storage::disk('public')->delete($movie->poster_path);
        }

        $path = $request->file('poster')->store('posters', 'public');
        $movie->update(['poster_path' => $path]);

        return response()->json(['data' => $this->transform($movie->fresh())]);
    }

    private function transform(Movie $movie): array
    {
        return [
            'id' => $movie->id,
            'title' => $movie->title,
            'duration' => $movie->duration,
            'description' => $movie->description,
            'country' => $movie->country,
            'poster_path' => $movie->poster_path,
            'poster_url' => $movie->posterUrl(),
        ];
    }
}
