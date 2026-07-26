<?php

namespace App\Services;

use App\Models\Booking;
use chillerlan\QRCode\Output\QRGdImagePNG;
use chillerlan\QRCode\Output\QRMarkupSVG;
use chillerlan\QRCode\QRCode;
use chillerlan\QRCode\QROptions;
use RuntimeException;

class QrCodeService
{
    private const PNG_SIGNATURE = "\x89PNG\r\n\x1a\n";

    public function payloadForBooking(Booking $booking): string
    {
        $booking->loadMissing(['tickets', 'seance']);

        $tickets = $booking->tickets->map(fn ($ticket) => [
            'row' => $ticket->row,
            'seat' => $ticket->seat,
            'seat_type' => $ticket->seat_type,
        ])->values()->all();

        return json_encode([
            'booking_code' => $booking->booking_code,
            'seance_id' => $booking->seance_id,
            'tickets' => $tickets,
        ], JSON_UNESCAPED_UNICODE);
    }

    /**
     * @return array{content: string, content_type: string}
     */
    public function render(string $payload): array
    {
        if (extension_loaded('gd')) {
            $png = $this->renderPng($payload);

            if ($png !== null) {
                return [
                    'content' => $png,
                    'content_type' => QRGdImagePNG::MIME_TYPE,
                ];
            }
        }

        $svg = $this->renderSvg($payload);

        return [
            'content' => $svg,
            'content_type' => QRMarkupSVG::MIME_TYPE,
        ];
    }

    private function renderPng(string $payload): ?string
    {
        try {
            $options = new QROptions([
                'outputInterface' => QRGdImagePNG::class,
                'scale' => 6,
                'outputBase64' => false,
            ]);

            $content = (new QRCode($options))->render($payload);

            if (! is_string($content) || ! str_starts_with($content, self::PNG_SIGNATURE)) {
                return null;
            }

            return $content;
        } catch (\Throwable) {
            return null;
        }
    }

    private function renderSvg(string $payload): string
    {
        $options = new QROptions([
            'outputInterface' => QRMarkupSVG::class,
            'scale' => 6,
            'svgAddXmlHeader' => true,
            'outputBase64' => false,
        ]);

        $content = (new QRCode($options))->render($payload);

        if (! is_string($content) || ! $this->isValidSvg($content)) {
            throw new RuntimeException('Не удалось сгенерировать QR-код.');
        }

        return $content;
    }

    private function isValidSvg(string $content): bool
    {
        return str_contains($content, '<svg');
    }
}
