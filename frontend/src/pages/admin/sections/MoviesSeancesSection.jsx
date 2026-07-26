import { api } from '../../../api/client';
import AccordionSection from '../../../components/AccordionSection';
import SeanceTimeline from '../../../components/SeanceTimeline';

export default function MoviesSeancesSection({
  movies,
  timeline,
  loadData,
  onError,
  onCreateMovie,
  onCreateSeance,
}) {
  const handleDeleteMovie = async (movie) => {
    if (!window.confirm(`Вы действительно хотите удалить фильм «${movie.title}»?`)) {
      return;
    }

    try {
      await api.deleteMovie(movie.id);
      await loadData();
    } catch (err) {
      onError(err.message);
    }
  };

  const handleDeleteSeance = async (seance) => {
    if (!window.confirm(`Вы действительно хотите удалить сеанс «${seance.movie_title}» в ${seance.start_time}?`)) {
      return;
    }

    try {
      await api.deleteSeance(seance.id);
      await loadData();
    } catch (err) {
      onError(err.message);
    }
  };

  return (
    <AccordionSection title="Сетка сеансов" defaultOpen>
      <p className="conf-step__paragraph">
        <button type="button" className="conf-step__button conf-step__button-accent" onClick={onCreateMovie}>
          Добавить фильм
        </button>
        {' '}
        <button type="button" className="conf-step__button conf-step__button-accent" onClick={onCreateSeance}>
          Добавить сеанс
        </button>
      </p>

      <div className="conf-step__movies">
        {movies.map((movie) => (
          <div className="conf-step__movie" key={movie.id}>
            <img className="conf-step__movie-poster" alt="poster" src={movie.poster_url || '/i/poster.svg'} />
            <h3 className="conf-step__movie-title">{movie.title}</h3>
            <p className="conf-step__movie-duration">{movie.duration} минут</p>
            <button
              type="button"
              className="conf-step__button conf-step__button-trash"
              onClick={() => handleDeleteMovie(movie)}
            />
          </div>
        ))}
      </div>

      <SeanceTimeline halls={timeline} onDeleteSeance={handleDeleteSeance} />
    </AccordionSection>
  );
}
