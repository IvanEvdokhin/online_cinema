import { api } from '../../../api/client';
import AccordionSection from '../../../components/AccordionSection';

export default function SalesSection({ settings, setSettings, logout, onError }) {
  const handleToggleSales = async () => {
    try {
      const response = await api.toggleSales();
      setSettings(response.data);
    } catch (err) {
      onError(err.message);
    }
  };

  return (
    <AccordionSection title="Открыть продажи" defaultOpen>
      <div className="conf-step__wrapper text-center">
        <p className="conf-step__paragraph">Всё готово, теперь можно:</p>
        <button
          type="button"
          className="conf-step__button conf-step__button-accent"
          onClick={handleToggleSales}
        >
          {settings.sales_open ? 'Приостановить продажу билетов' : 'Открыть продажу билетов'}
        </button>
        <p className="conf-step__paragraph">
          <button type="button" className="conf-step__button conf-step__button-regular" onClick={logout}>
            Выйти
          </button>
        </p>
      </div>
    </AccordionSection>
  );
}
