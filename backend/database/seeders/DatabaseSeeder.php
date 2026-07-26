<?php

namespace Database\Seeders;

use App\Models\Hall;
use App\Models\HallPrice;
use App\Models\Movie;
use App\Models\Seance;
use App\Models\Setting;
use App\Models\User;
use App\Services\HallLayoutService;
use Carbon\Carbon;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        User::query()->updateOrCreate(
            ['email' => env('ADMIN_EMAIL', 'admin@cinema.local')],
            [
                'name' => 'Administrator',
                'password' => Hash::make(env('ADMIN_PASSWORD', 'password')),
            ],
        );

        Setting::current();

        $hall = Hall::query()->firstOrCreate(
            ['name' => 'Зал 1'],
            [
                'rows' => 8,
                'cols' => 8,
                'seat_layout' => HallLayoutService::defaultLayout(8, 8),
                'is_active' => true,
            ],
        );

        foreach (['standard' => 250, 'vip' => 350] as $seatType => $price) {
            HallPrice::query()->updateOrCreate(
                ['hall_id' => $hall->id, 'seat_type' => $seatType],
                ['price' => $price],
            );
        }

        $movie = Movie::query()->firstOrCreate(
            ['title' => 'Звёздные войны XXIII: Атака клонированных клонов'],
            [
                'duration' => 130,
                'description' => 'Эпическая сага продолжается в далёкой-далёкой галактике.',
                'country' => 'США',
            ],
        );

        Seance::query()->firstOrCreate(
            [
                'hall_id' => $hall->id,
                'start_datetime' => Carbon::today()->setTime(18, 30),
            ],
            ['movie_id' => $movie->id],
        );
    }
}
