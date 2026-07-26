import { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { api } from '../../api/client';

export default function TicketPage() {
  const { code } = useParams();
  const [booking, setBooking] = useState(null);
  const [error, setError] = useState('');
  const [qrUrl, setQrUrl] = useState('');
  const [qrError, setQrError] = useState('');
  const qrObjectUrlRef = useRef('');

  useEffect(() => {
    api.getBooking(code)
      .then((response) => setBooking(response.data))
      .catch((err) => setError(err.message));
  }, [code]);

  useEffect(() => {
    if (!code) {
      return undefined;
    }

    let cancelled = false;
    setQrError('');
    setQrUrl('');

    fetch(api.bookingQrUrl(code))
      .then((response) => {
        if (!response.ok) {
          throw new Error('Не удалось загрузить QR-код');
        }

        return response.blob();
      })
      .then((blob) => {
        if (cancelled) {
          return;
        }

        if (qrObjectUrlRef.current) {
          URL.revokeObjectURL(qrObjectUrlRef.current);
        }

        const objectUrl = URL.createObjectURL(blob);
        qrObjectUrlRef.current = objectUrl;
        setQrUrl(objectUrl);
      })
      .catch((err) => {
        if (!cancelled) {
          setQrError(err.message);
        }
      });

    return () => {
      cancelled = true;

      if (qrObjectUrlRef.current) {
        URL.revokeObjectURL(qrObjectUrlRef.current);
        qrObjectUrlRef.current = '';
      }
    };
  }, [code]);

  if (error) {
    return <main><p className="ticket__hint">{error}</p></main>;
  }

  if (!booking) {
    return <main><p className="ticket__hint">Загрузка билета...</p></main>;
  }

  const seatLabels = booking.tickets.map(({ row, seat }) => `${row + 1}/${seat + 1}`).join(', ');

  return (
    <>
      <header className="page-header">
        <h1 className="page-header__title">Идём<span>в</span>кино</h1>
      </header>

      <main>
        <section className="ticket">
          <header className="ticket__check">
            <h2 className="ticket__check-title">Электронный билет</h2>
          </header>

          <div className="ticket__info-wrapper">
            <p className="ticket__info">
              На фильм: <span className="ticket__details ticket__title">{booking.seance.movie_title}</span>
            </p>
            <p className="ticket__info">
              Места: <span className="ticket__details ticket__chairs">{seatLabels}</span>
            </p>
            <p className="ticket__info">
              В зале: <span className="ticket__details ticket__hall">{booking.seance.hall_name}</span>
            </p>
            <p className="ticket__info">
              Начало сеанса: <span className="ticket__details ticket__start">{booking.seance.start_time}</span>
            </p>

            {qrUrl && (
              <img className="ticket__info-qr" src={qrUrl} alt="QR-код бронирования" />
            )}
            {qrError && <p className="ticket__hint">{qrError}</p>}

            <p className="ticket__hint">Покажите QR-код нашему контроллеру для подтверждения бронирования.</p>
            <p className="ticket__hint">Приятного просмотра!</p>
          </div>
        </section>
      </main>
    </>
  );
}
