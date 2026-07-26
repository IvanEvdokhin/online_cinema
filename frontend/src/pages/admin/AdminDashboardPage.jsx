import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { api } from '../../api/client';
import Popup from '../../components/Popup';
import { useAuth } from '../../context/AuthContext';
import { formatDateKey } from '../../utils/seats';
import useAdminData from './useAdminData';
import HallsSection from './sections/HallsSection';
import HallLayoutSection from './sections/HallLayoutSection';
import PricesSection from './sections/PricesSection';
import MoviesSeancesSection from './sections/MoviesSeancesSection';
import SalesSection from './sections/SalesSection';

export default function AdminDashboardPage() {
  const { isAuthenticated, logout } = useAuth();
  const {
    halls,
    movies,
    timeline,
    settings,
    setSettings,
    selectedHallId,
    setSelectedHallId,
    selectedPriceHallId,
    setSelectedPriceHallId,
    selectedHall,
    selectedPriceHall,
    selectedDate,
    loadData,
  } = useAdminData(isAuthenticated);

  const [modal, setModal] = useState(null);
  const [formError, setFormError] = useState('');
  const [actionError, setActionError] = useState('');

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  const closeModal = () => {
    setModal(null);
    setFormError('');
  };

  const handleError = (message) => {
    setActionError(message);
  };

  const handleCreateHall = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    try {
      await api.createHall({ name: formData.get('name') });
      closeModal();
      await loadData();
    } catch (err) {
      setFormError(err.message);
    }
  };

  const handleCreateMovie = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    try {
      const response = await api.createMovie({
        title: formData.get('title'),
        duration: Number(formData.get('duration')),
        description: formData.get('description'),
        country: formData.get('country'),
      });
      const poster = formData.get('poster');
      if (poster && poster.size > 0) {
        await api.uploadPoster(response.data.id, poster);
      }
      closeModal();
      await loadData();
    } catch (err) {
      setFormError(err.message);
    }
  };

  const handleCreateSeance = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const date = formatDateKey(selectedDate);
    const time = formData.get('start_time');
    try {
      await api.createSeance({
        hall_id: Number(formData.get('hall_id')),
        movie_id: Number(formData.get('movie_id')),
        start_datetime: `${date}T${time}:00`,
      });
      closeModal();
      await loadData();
    } catch (err) {
      setFormError(err.message);
    }
  };

  return (
    <>
      <header className="page-header">
        <h1 className="page-header__title">Идём<span>в</span>кино</h1>
        <span className="page-header__subtitle">Администраторррская</span>
      </header>

      <main className="conf-steps">
        {actionError && <p className="explanation-text">{actionError}</p>}

        <HallsSection
          halls={halls}
          loadData={loadData}
          onError={handleError}
          onCreateHall={() => setModal('hall')}
        />

        <HallLayoutSection
          halls={halls}
          selectedHall={selectedHall}
          selectedHallId={selectedHallId}
          setSelectedHallId={setSelectedHallId}
          loadData={loadData}
          onError={handleError}
        />

        <PricesSection
          halls={halls}
          selectedPriceHall={selectedPriceHall}
          selectedPriceHallId={selectedPriceHallId}
          setSelectedPriceHallId={setSelectedPriceHallId}
          loadData={loadData}
          onError={handleError}
        />

        <MoviesSeancesSection
          movies={movies}
          timeline={timeline}
          loadData={loadData}
          onError={handleError}
          onCreateMovie={() => setModal('movie')}
          onCreateSeance={() => setModal('seance')}
        />

        <SalesSection
          settings={settings}
          setSettings={setSettings}
          logout={logout}
          onError={handleError}
        />
      </main>

      {modal === 'hall' && (
        <Popup title="Добавление зала" onClose={closeModal}>
          <form onSubmit={handleCreateHall}>
            <label className="conf-step__label conf-step__label-fullsize">
              Название зала
              <input className="conf-step__input" type="text" name="name" placeholder="Например, «Зал 1»" required />
            </label>
            {formError && <p className="conf-step__hint">{formError}</p>}
            <div className="conf-step__buttons text-center">
              <input type="submit" value="Добавить зал" className="conf-step__button conf-step__button-accent" />
              <button type="button" className="conf-step__button conf-step__button-regular" onClick={closeModal}>
                Отменить
              </button>
            </div>
          </form>
        </Popup>
      )}

      {modal === 'movie' && (
        <Popup title="Добавление фильма" onClose={closeModal}>
          <form onSubmit={handleCreateMovie}>
            <label className="conf-step__label conf-step__label-fullsize">
              Название фильма
              <input className="conf-step__input" type="text" name="title" required />
            </label>
            <label className="conf-step__label conf-step__label-fullsize">
              Продолжительность фильма (мин.)
              <input className="conf-step__input" type="number" name="duration" required />
            </label>
            <label className="conf-step__label conf-step__label-fullsize">
              Описание фильма
              <textarea className="conf-step__input" name="description" required />
            </label>
            <label className="conf-step__label conf-step__label-fullsize">
              Страна
              <input className="conf-step__input" type="text" name="country" required />
            </label>
            <label className="conf-step__label conf-step__label-fullsize">
              Постер
              <input className="conf-step__input" type="file" name="poster" accept="image/*" />
            </label>
            {formError && <p className="conf-step__hint">{formError}</p>}
            <div className="conf-step__buttons text-center">
              <input type="submit" value="Добавить фильм" className="conf-step__button conf-step__button-accent" />
              <button type="button" className="conf-step__button conf-step__button-regular" onClick={closeModal}>
                Отменить
              </button>
            </div>
          </form>
        </Popup>
      )}

      {modal === 'seance' && (
        <Popup title="Добавление сеанса" onClose={closeModal}>
          <form onSubmit={handleCreateSeance}>
            <label className="conf-step__label conf-step__label-fullsize">
              Название зала
              <select className="conf-step__input" name="hall_id" required>
                {halls.map((hall) => (
                  <option key={hall.id} value={hall.id}>{hall.name}</option>
                ))}
              </select>
            </label>
            <label className="conf-step__label conf-step__label-fullsize">
              Название фильма
              <select className="conf-step__input" name="movie_id" required>
                {movies.map((movie) => (
                  <option key={movie.id} value={movie.id}>{movie.title}</option>
                ))}
              </select>
            </label>
            <label className="conf-step__label conf-step__label-fullsize">
              Время начала
              <input className="conf-step__input" type="time" name="start_time" defaultValue="18:30" required />
            </label>
            {formError && <p className="conf-step__hint">{formError}</p>}
            <div className="conf-step__buttons text-center">
              <input type="submit" value="Добавить" className="conf-step__button conf-step__button-accent" />
              <button type="button" className="conf-step__button conf-step__button-regular" onClick={closeModal}>
                Отменить
              </button>
            </div>
          </form>
        </Popup>
      )}
    </>
  );
}
