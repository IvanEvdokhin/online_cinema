import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../api/client';
import DayNavigator from '../../components/DayNavigator';
import { formatDateKey } from '../../utils/seats';

export default function SchedulePage() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    setError('');
    api.getSchedule(formatDateKey(selectedDate))
      .then((response) => setMovies(response.data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [selectedDate]);

  return (
    <>
      <header className="page-header">
        <h1 className="page-header__title">Идём<span>в</span>кино</h1>
      </header>

      <DayNavigator selectedDate={selectedDate} onChange={setSelectedDate} />

      <main>
        {loading && <p className="movie__synopsis">Загрузка расписания...</p>}
        {error && <p className="movie__synopsis">{error}</p>}
        {!loading && !error && movies.length === 0 && (
          <p className="movie__synopsis">На выбранный день сеансов нет или продажи ещё не открыты.</p>
        )}

        {movies.map((movie) => (
          <section className="movie" key={movie.id}>
            <div className="movie__info">
              <div className="movie__poster">
                <img
                  className="movie__poster-image"
                  alt={movie.title}
                  src={movie.poster_url || '/i/poster.svg'}
                />
              </div>
              <div className="movie__description">
                <h2 className="movie__title">{movie.title}</h2>
                <p className="movie__synopsis">{movie.description}</p>
                <p className="movie__data">
                  <span className="movie__data-duration">{movie.duration} минут</span>
                  <span className="movie__data-origin">{movie.country}</span>
                </p>
              </div>
            </div>

            {movie.halls.map((hall) => (
              <div className="movie-seances__hall" key={hall.hall_id}>
                <h3 className="movie-seances__hall-title">{hall.hall_name}</h3>
                <ul className="movie-seances__list">
                  {hall.seances.map((seance) => (
                    <li className="movie-seances__time-block" key={seance.id}>
                      <Link className="movie-seances__time" to={`/hall/${seance.id}`}>
                        {seance.start_time}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </section>
        ))}
      </main>
    </>
  );
}
