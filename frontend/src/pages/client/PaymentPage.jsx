import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { api } from '../../api/client';

export default function PaymentPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { seanceId, seance, selectedSeats, total } = location.state || {};
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [email, setEmail] = useState('');

  if (!seance || !selectedSeats?.length) {
    return (
      <main>
        <p className="ticket__hint">Данные бронирования не найдены.</p>
      </main>
    );
  }

  const seatLabels = selectedSeats.map(({ row, seat }) => `${row + 1}/${seat + 1}`).join(', ');

  const handleSubmit = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await api.createBooking({
        seance_id: Number(seanceId),
        seats: selectedSeats,
        email,
      });
      navigate(`/ticket/${response.data.booking_code}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <header className="page-header">
        <h1 className="page-header__title">Идём<span>в</span>кино</h1>
      </header>

      <main>
        <section className="ticket">
          <header className="ticket__check">
            <h2 className="ticket__check-title">Вы выбрали билеты:</h2>
          </header>

          <div className="ticket__info-wrapper">
            <p className="ticket__info">
              На фильм: <span className="ticket__details ticket__title">{seance.movie.title}</span>
            </p>
            <p className="ticket__info">
              Места: <span className="ticket__details ticket__chairs">{seatLabels}</span>
            </p>
            <p className="ticket__info">
              В зале: <span className="ticket__details ticket__hall">{seance.hall.name}</span>
            </p>
            <p className="ticket__info">
              Начало сеанса: <span className="ticket__details ticket__start">{seance.start_time}</span>
            </p>
            <p className="ticket__info">
              Стоимость: <span className="ticket__details ticket__cost">{total}</span> рублей
            </p>

            {error && <p className="ticket__hint">{error}</p>}

            <label className="ticket__info">
              Email для отправки билета:
              <input
                className="conf-step__input"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="example@mail.ru"
              />
            </label>

            <button className="acceptin-button" type="button" onClick={handleSubmit} disabled={loading || !email}>
              {loading ? 'Бронирование...' : 'Получить код бронирования'}
            </button>

            <p className="ticket__hint">
              После оплаты билет будет доступен в этом окне, а также придёт вам на почту. Покажите QR-код нашему контроллёру у входа в зал.
            </p>
            <p className="ticket__hint">Приятного просмотра!</p>
          </div>
        </section>
      </main>
    </>
  );
}
