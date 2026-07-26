import { api } from '../../../api/client';
import AccordionSection from '../../../components/AccordionSection';

export default function HallsSection({ halls, loadData, onError, onCreateHall }) {
  const handleToggleActive = async (hall) => {
    try {
      await api.toggleHallActive(hall.id);
      await loadData();
    } catch (err) {
      onError(err.message);
    }
  };

  const handleDelete = async (hall) => {
    if (!window.confirm(`Вы действительно хотите удалить зал «${hall.name}»?`)) {
      return;
    }

    try {
      await api.deleteHall(hall.id);
      await loadData();
    } catch (err) {
      onError(err.message);
    }
  };

  return (
    <AccordionSection title="Управление залами" defaultOpen>
      <p className="conf-step__paragraph">Доступные залы:</p>
      <ul className="conf-step__list">
        {halls.map((hall) => (
          <li key={hall.id}>
            {hall.name} {hall.is_active ? '(активен)' : '(неактивен)'}
            <button
              type="button"
              className="conf-step__button conf-step__button-regular"
              onClick={() => handleToggleActive(hall)}
            >
              {hall.is_active ? 'Деактивировать' : 'Активировать'}
            </button>
            <button
              type="button"
              className="conf-step__button conf-step__button-trash"
              onClick={() => handleDelete(hall)}
            />
          </li>
        ))}
      </ul>
      <button type="button" className="conf-step__button conf-step__button-accent" onClick={onCreateHall}>
        Создать зал
      </button>
    </AccordionSection>
  );
}
