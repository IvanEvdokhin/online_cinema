<?php

use App\Http\Controllers\Admin\AuthController;
use App\Http\Controllers\Admin\HallController;
use App\Http\Controllers\Admin\MovieController;
use App\Http\Controllers\Admin\SeanceController;
use App\Http\Controllers\Admin\SettingController;
use App\Http\Controllers\Api\BookingController;
use App\Http\Controllers\Api\ScheduleController;
use App\Http\Controllers\Api\SeanceController as PublicSeanceController;
use Illuminate\Support\Facades\Route;

Route::get('/schedule', [ScheduleController::class, 'index']);
Route::get('/seances/{seance}', [PublicSeanceController::class, 'show']);
Route::post('/bookings', [BookingController::class, 'store']);
Route::get('/bookings/{code}/qr', [BookingController::class, 'qr']);
Route::get('/bookings/{code}', [BookingController::class, 'show']);

Route::prefix('admin')->group(function () {
    Route::post('/login', [AuthController::class, 'login']);

    Route::middleware('auth:sanctum')->group(function () {
        Route::post('/logout', [AuthController::class, 'logout']);
        Route::get('/me', [AuthController::class, 'me']);

        Route::apiResource('halls', HallController::class)->except(['show']);
        Route::put('/halls/{hall}/layout', [HallController::class, 'updateLayout']);
        Route::put('/halls/{hall}/prices', [HallController::class, 'updatePrices']);
        Route::patch('/halls/{hall}/toggle-active', [HallController::class, 'toggleActive']);

        Route::apiResource('movies', MovieController::class);
        Route::post('/movies/{movie}/poster', [MovieController::class, 'uploadPoster']);

        Route::get('/seances/timeline', [SeanceController::class, 'timeline']);
        Route::apiResource('seances', SeanceController::class);

        Route::get('/settings', [SettingController::class, 'show']);
        Route::patch('/settings/sales', [SettingController::class, 'toggleSales']);
    });
});
