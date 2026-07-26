<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\StoreBookingRequest;
use App\Models\Booking;
use App\Models\Seance;
use App\Services\BookingMailService;
use App\Services\BookingService;
use App\Services\QrCodeService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Response;

class BookingController extends Controller
{
    public function __construct(
        private readonly BookingService $bookingService,
        private readonly BookingMailService $bookingMailService,
        private readonly QrCodeService $qrCodeService,
    ) {
    }

    public function store(StoreBookingRequest $request): JsonResponse
    {
        $seance = Seance::query()->with(['hall.prices', 'movie'])->findOrFail($request->validated('seance_id'));
        $booking = $this->bookingService->create(
            $seance,
            $request->validated('seats'),
            $request->validated('email'),
        );

        $this->bookingMailService->send($booking, $request->validated('email'));

        return response()->json(['data' => $this->transform($booking)], 201);
    }

    public function show(string $code): JsonResponse
    {
        $booking = Booking::query()
            ->where('booking_code', $code)
            ->with(['tickets', 'seance.movie', 'seance.hall'])
            ->firstOrFail();

        return response()->json(['data' => $this->transform($booking)]);
    }

    public function qr(string $code): Response
    {
        $booking = Booking::query()
            ->where('booking_code', $code)
            ->with(['tickets', 'seance'])
            ->firstOrFail();

        $payload = $this->qrCodeService->payloadForBooking($booking);
        $qr = $this->qrCodeService->render($payload);

        return response($qr['content'], 200, [
            'Content-Type' => $qr['content_type'],
            'Cache-Control' => 'no-cache, no-store, must-revalidate',
        ]);
    }

    private function transform(Booking $booking): array
    {
        $booking->loadMissing(['tickets', 'seance.movie', 'seance.hall']);

        return [
            'booking_code' => $booking->booking_code,
            'total_price' => $booking->total_price,
            'seance' => [
                'id' => $booking->seance->id,
                'start_time' => $booking->seance->start_datetime->format('H:i'),
                'date' => $booking->seance->start_datetime->toDateString(),
                'movie_title' => $booking->seance->movie->title,
                'hall_name' => $booking->seance->hall->name,
            ],
            'tickets' => $booking->tickets->map(fn ($ticket) => [
                'row' => $ticket->row,
                'seat' => $ticket->seat,
                'seat_type' => $ticket->seat_type,
                'price' => $ticket->price,
            ])->values(),
        ];
    }
}
