import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { api } from '../../api/client';
import SeatGrid from '../../components/SeatGrid';
import { calculateTotal, toggleSeatSelection } from '../../utils/seats';

export default function HallPage() {
  const { seanceId } = useParams();
  const navigate = useNavigate();
  const [seance, setSeance] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    api.getSeance(seanceId)
      .then((response) => setSeance(response.data))
      .catch((err) => setError(err.message));
  }, [seanceId]);

  if (error) {
    return <main><p className="movie__synopsis">{error}</p></main>;
  }

  if (!seance) {
    return <main><p className="movie__synopsis">Загрузка...</p></main>;
  }

  const prices = seance.hall.prices;
  const total = calculateTotal(selectedSeats, seance.hall.seat_layout, prices);

  const handleBook = () => {
    if (selectedSeats.length === 0) {
      return;
    }

    navigate('/payment', {
      state: {
        seanceId: seance.id,
        seance,
        selectedSeats,
        total,
      },
    });
  };

  return (
    <>
      <header className="page-header">
        <h1 className="page-header__title">Идём<span>в</span>кино</h1>
      </header>

      <main>
        <section className="buying">
          <div className="buying__info">
            <div className="buying__info-description">
              <h2 className="buying__info-title">{seance.movie.title}</h2>
              <p className="buying__info-start">Начало сеанса: {seance.start_time}</p>
              <p className="buying__info-hall">{seance.hall.name}</p>
            </div>
            <div className="buying__info-hint">
              <p>Тапните дважды,<br />чтобы увеличить</p>
            </div>
          </div>

          <div className="buying-scheme">
            <SeatGrid
              layout={seance.hall.seat_layout}
              mode="client"
              takenSeats={seance.taken_seats}
              selectedSeats={selectedSeats}
              onSeatClick={(row, seat, type) => {
                if (type === 'disabled') return;
                setSelectedSeats((current) => toggleSeatSelection(current, row, seat));
              }}
            />

            <div className="buying-scheme__legend">
              <div className="col">
                <p className="buying-scheme__legend-price">
                  <span className="buying-scheme__chair buying-scheme__chair_standart" />
                  {' '}Свободно (<span className="buying-scheme__legend-value">{prices.standard}</span>руб)
                </p>
                <p className="buying-scheme__legend-price">
                  <span className="buying-scheme__chair buying-scheme__chair_vip" />
                  {' '}Свободно VIP (<span className="buying-scheme__legend-value">{prices.vip}</span>руб)
                </p>
              </div>
              <div className="col">
                <p className="buying-scheme__legend-price">
                  <span className="buying-scheme__chair buying-scheme__chair_taken" /> Занято
                </p>
                <p className="buying-scheme__legend-price">
                  <span className="buying-scheme__chair buying-scheme__chair_selected" /> Выбрано
                </p>
              </div>
            </div>
          </div>

          <button className="acceptin-button" type="button" onClick={handleBook} disabled={selectedSeats.length === 0}>
            Забронировать
          </button>
        </section>
      </main>
    </>
  );
}
