<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreHallRequest;
use App\Http\Requests\Admin\UpdateHallLayoutRequest;
use App\Http\Requests\Admin\UpdateHallPricesRequest;
use App\Http\Requests\Admin\UpdateHallRequest;
use App\Models\Hall;
use App\Models\HallPrice;
use App\Services\HallLayoutService;
use Illuminate\Http\JsonResponse;

class HallController extends Controller
{
    public function index(): JsonResponse
    {
        $halls = Hall::query()->with('prices')->orderBy('name')->get();

        return response()->json(['data' => $halls]);
    }

    public function store(StoreHallRequest $request): JsonResponse
    {
        $hall = Hall::query()->create([
            'name' => $request->validated('name'),
            'rows' => 0,
            'cols' => 0,
            'seat_layout' => [],
            'is_active' => false,
        ]);

        foreach (['standard', 'vip'] as $seatType) {
            HallPrice::query()->create([
                'hall_id' => $hall->id,
                'seat_type' => $seatType,
                'price' => 0,
            ]);
        }

        return response()->json(['data' => $hall->load('prices')], 201);
    }

    public function update(UpdateHallRequest $request, Hall $hall): JsonResponse
    {
        $hall->update($request->validated());

        return response()->json(['data' => $hall->fresh('prices')]);
    }

    public function destroy(Hall $hall): JsonResponse
    {
        $hall->delete();

        return response()->json(['message' => 'Hall deleted']);
    }

    public function updateLayout(UpdateHallLayoutRequest $request, Hall $hall): JsonResponse
    {
        $rows = $request->validated('rows');
        $cols = $request->validated('cols');
        $layout = $request->validated('seat_layout');

        if (! HallLayoutService::validateLayout($layout, $rows, $cols)) {
            return response()->json(['message' => 'Некорректная схема зала.'], 422);
        }

        $hall->update([
            'rows' => $rows,
            'cols' => $cols,
            'seat_layout' => $layout,
        ]);

        return response()->json(['data' => $hall->fresh('prices')]);
    }

    public function updatePrices(UpdateHallPricesRequest $request, Hall $hall): JsonResponse
    {
        foreach ($request->validated('prices') as $priceData) {
            HallPrice::query()->updateOrCreate(
                [
                    'hall_id' => $hall->id,
                    'seat_type' => $priceData['seat_type'],
                ],
                ['price' => $priceData['price']],
            );
        }

        return response()->json(['data' => $hall->fresh('prices')]);
    }

    public function toggleActive(Hall $hall): JsonResponse
    {
        $hall->update(['is_active' => ! $hall->is_active]);

        return response()->json(['data' => $hall->fresh('prices')]);
    }
}
