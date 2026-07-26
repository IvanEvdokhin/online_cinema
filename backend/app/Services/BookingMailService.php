<?php

namespace App\Services;

use App\Models\Booking;
use Illuminate\Support\Facades\Log;
use PHPMailer\PHPMailer\Exception as MailException;
use PHPMailer\PHPMailer\PHPMailer;

class BookingMailService
{
    public function __construct(private readonly QrCodeService $qrCodeService)
    {
    }

    public function send(Booking $booking, string $email): void
    {
        $booking->loadMissing(['tickets', 'seance.movie', 'seance.hall']);

        try {
            $mail = $this->createMailer();
            $mail->addAddress($email);

            $mail->Subject = 'Ваш билет — '.$booking->seance->movie->title;
            $mail->isHTML(true);
            $mail->Body = $this->buildHtmlBody($booking);
            $mail->AltBody = $this->buildPlainBody($booking);

            $payload = $this->qrCodeService->payloadForBooking($booking);
            $qr = $this->qrCodeService->render($payload);

            if (str_starts_with($qr['content_type'], 'image/')) {
                $mail->addStringAttachment(
                    $qr['content'],
                    'qr-code.png',
                    PHPMailer::ENCODING_BASE64,
                    $qr['content_type'],
                );
            }

            $mail->send();
        } catch (MailException $exception) {
            Log::error('Failed to send booking email', [
                'booking_code' => $booking->booking_code,
                'email' => $email,
                'error' => $exception->getMessage(),
            ]);
        }
    }

    private function createMailer(): PHPMailer
    {
        $mail = new PHPMailer(true);
        $mail->CharSet = PHPMailer::CHARSET_UTF8;
        $mail->isSMTP();
        $mail->Host = (string) env('MAIL_HOST', '127.0.0.1');
        $mail->Port = (int) env('MAIL_PORT', 2525);
        $mail->SMTPAuth = env('MAIL_USERNAME') !== null && env('MAIL_USERNAME') !== '';
        $mail->Username = (string) env('MAIL_USERNAME', '');
        $mail->Password = (string) env('MAIL_PASSWORD', '');

        $encryption = env('MAIL_ENCRYPTION');
        if ($encryption !== null && $encryption !== '') {
            $mail->SMTPSecure = $encryption;
        }

        $mail->setFrom(
            (string) env('MAIL_FROM_ADDRESS', 'hello@example.com'),
            (string) env('MAIL_FROM_NAME', 'IdemVkino'),
        );

        return $mail;
    }

    private function buildHtmlBody(Booking $booking): string
    {
        $seance = $booking->seance;
        $ticketUrl = rtrim((string) env('FRONTEND_URL', 'http://localhost:5173'), '/')
            .'/ticket/'.$booking->booking_code;
        $seatLabels = $booking->tickets
            ->map(fn ($ticket) => ($ticket->row + 1).'/'.($ticket->seat + 1))
            ->join(', ');

        return <<<HTML
        <h2>Электронный билет</h2>
        <p><strong>Фильм:</strong> {$this->escape($seance->movie->title)}</p>
        <p><strong>Зал:</strong> {$this->escape($seance->hall->name)}</p>
        <p><strong>Начало:</strong> {$seance->start_datetime->format('d.m.Y H:i')}</p>
        <p><strong>Места:</strong> {$this->escape($seatLabels)}</p>
        <p><strong>Стоимость:</strong> {$booking->total_price} руб.</p>
        <p><a href="{$this->escape($ticketUrl)}">Открыть билет</a></p>
        <p>QR-код прикреплён к письму. Покажите его контролёру у входа в зал.</p>
        HTML;
    }

    private function buildPlainBody(Booking $booking): string
    {
        $seance = $booking->seance;
        $ticketUrl = rtrim((string) env('FRONTEND_URL', 'http://localhost:5173'), '/')
            .'/ticket/'.$booking->booking_code;
        $seatLabels = $booking->tickets
            ->map(fn ($ticket) => ($ticket->row + 1).'/'.($ticket->seat + 1))
            ->join(', ');

        return implode("\n", [
            'Электронный билет',
            'Фильм: '.$seance->movie->title,
            'Зал: '.$seance->hall->name,
            'Начало: '.$seance->start_datetime->format('d.m.Y H:i'),
            'Места: '.$seatLabels,
            'Стоимость: '.$booking->total_price.' руб.',
            'Билет: '.$ticketUrl,
        ]);
    }

    private function escape(string $value): string
    {
        return htmlspecialchars($value, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
    }
}
