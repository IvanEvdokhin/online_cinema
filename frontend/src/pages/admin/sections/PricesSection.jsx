import { useEffect, useState } from 'react';
import { api } from '../../../api/client';
import AccordionSection from '../../../components/AccordionSection';

export default function PricesSection({
  halls,
  selectedPriceHall,
  selectedPriceHallId,
  setSelectedPriceHallId,
  loadData,
  onError,
}) {
  const [prices, setPrices] = useState({ standard: 0, vip: 0 });

  useEffect(() => {
    if (!selectedPriceHall) return;
    const standard = selectedPriceHall.prices?.find((item) => item.seat_type === 'standard')?.price || 0;
    const vip = selectedPriceHall.prices?.find((item) => item.seat_type === 'vip')?.price || 0;
    setPrices({ standard, vip });
  }, [selectedPriceHall]);

  const savePrices = async () => {
    if (!selectedPriceHall) return;

    try {
      await api.updateHallPrices(selectedPriceHall.id, {
        prices: [
          { seat_type: 'standard', price: Number(prices.standard) },
          { seat_type: 'vip', price: Number(prices.vip) },
        ],
      });
      await loadData();
    } catch (err) {
      onError(err.message);
    }
  };

  return (
    <AccordionSection title="Конфигурация цен" defaultOpen>
      <p className="conf-step__paragraph">Выберите зал для конфигурации:</p>
      <ul className="conf-step__selectors-box">
        {halls.map((hall) => (
          <li key={hall.id}>
            <input
              type="radio"
              className="conf-step__radio"
              name="prices-hall"
              checked={selectedPriceHallId === hall.id}
              onChange={() => setSelectedPriceHallId(hall.id)}
            />
            <span className="conf-step__selector">{hall.name}</span>
          </li>
        ))}
      </ul>

      <p className="conf-step__paragraph">Установите цены для типов кресел:</p>
      <div className="conf-step__legend">
        <label className="conf-step__label">
          Цена, рублей
          <input
            className="conf-step__input"
            value={prices.standard}
            onChange={(e) => setPrices((current) => ({ ...current, standard: e.target.value }))}
          />
        </label>
        {' '}за <span className="conf-step__chair conf-step__chair_standart" /> обычные кресла
      </div>
      <div className="conf-step__legend">
        <label className="conf-step__label">
          Цена, рублей
          <input
            className="conf-step__input"
            value={prices.vip}
            onChange={(e) => setPrices((current) => ({ ...current, vip: e.target.value }))}
          />
        </label>
        {' '}за <span className="conf-step__chair conf-step__chair_vip" /> VIP кресла
      </div>

      <fieldset className="conf-step__buttons text-center">
        <button type="button" className="conf-step__button conf-step__button-accent" onClick={savePrices}>
          Сохранить
        </button>
      </fieldset>
    </AccordionSection>
  );
}
