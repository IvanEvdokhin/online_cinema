<?php

namespace App\Services;

use App\Models\Booking;
use App\Models\Hall;
use App\Models\Seance;
use App\Models\Setting;
use App\Models\Ticket;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class BookingService
{
    public function create(Seance $seance, array $seats, string $email): Booking
    {
        if (! Setting::current()->sales_open) {
            throw ValidationException::withMessages([
                'seance_id' => ['Продажа билетов временно приостановлена.'],
            ]);
        }

        $hall = $seance->hall()->with('prices')->firstOrFail();

        if (! $hall->is_active) {
            throw ValidationException::withMessages([
                'seance_id' => ['Зал недоступен для бронирования.'],
            ]);
        }

        return DB::transaction(function () use ($seance, $seats, $hall, $email) {
            $lockedSeance = Seance::query()->lockForUpdate()->findOrFail($seance->id);
            $taken = Ticket::query()
                ->where('seance_id', $lockedSeance->id)
                ->get(['row', 'seat'])
                ->map(fn (Ticket $ticket) => $ticket->row.'-'.$ticket->seat)
                ->all();

            $totalPrice = 0;
            $preparedTickets = [];

            foreach ($seats as $seat) {
                $row = (int) $seat['row'];
                $seatNumber = (int) $seat['seat'];
                $key = $row.'-'.$seatNumber;

                if (in_array($key, $taken, true)) {
                    throw ValidationException::withMessages([
                        'seats' => ["Место {$row}/{$seatNumber} уже занято."],
                    ]);
                }

                $seatType = $hall->seatTypeAt($row, $seatNumber);

                if ($seatType === null) {
                    throw ValidationException::withMessages([
                        'seats' => ["Место {$row}/{$seatNumber} недоступно для бронирования."],
                    ]);
                }

                $price = $hall->priceFor($seatType);
                $totalPrice += $price;
                $preparedTickets[] = [
                    'row' => $row,
                    'seat' => $seatNumber,
                    'seat_type' => $seatType,
                    'price' => $price,
                ];
            }

            $booking = Booking::query()->create([
                'booking_code' => (string) Str::uuid(),
                'seance_id' => $lockedSeance->id,
                'total_price' => $totalPrice,
                'email' => $email,
            ]);

            foreach ($preparedTickets as $ticketData) {
                Ticket::query()->create([
                    'booking_id' => $booking->id,
                    'seance_id' => $lockedSeance->id,
                    ...$ticketData,
                ]);
            }

            return $booking->load(['tickets', 'seance.movie', 'seance.hall']);
        });
    }
}
