import { useEffect, useState } from 'react';
import { api } from '../../../api/client';
import AccordionSection from '../../../components/AccordionSection';
import SeatGrid from '../../../components/SeatGrid';
import { nextSeatType } from '../../../utils/seats';

function emptyLayout(rows, cols) {
  return Array.from({ length: rows }, () => Array.from({ length: cols }, () => 'disabled'));
}

export default function HallLayoutSection({ halls, selectedHall, selectedHallId, setSelectedHallId, loadData, onError }) {
  const [layoutRows, setLayoutRows] = useState('8');
  const [layoutCols, setLayoutCols] = useState('8');
  const [layout, setLayout] = useState(emptyLayout(8, 8));

  useEffect(() => {
    if (!selectedHall) return;
    setLayoutRows(String(selectedHall.rows || 8));
    setLayoutCols(String(selectedHall.cols || 8));
    setLayout(selectedHall.seat_layout?.length ? selectedHall.seat_layout : emptyLayout(8, 8));
  }, [selectedHall]);

  const applyGridSize = () => {
    const rows = Number(layoutRows) || 1;
    const cols = Number(layoutCols) || 1;
    setLayout(emptyLayout(rows, cols).map((row, rowIndex) =>
      row.map((cell, colIndex) => layout[rowIndex]?.[colIndex] || cell),
    ));
  };

  const saveLayout = async () => {
    if (!selectedHall) return;

    try {
      await api.updateHallLayout(selectedHall.id, {
        rows: Number(layoutRows),
        cols: Number(layoutCols),
        seat_layout: layout,
      });
      await loadData();
    } catch (err) {
      onError(err.message);
    }
  };

  return (
    <AccordionSection title="Конфигурация залов" defaultOpen>
      <p className="conf-step__paragraph">Выберите зал для конфигурации:</p>
      <ul className="conf-step__selectors-box">
        {halls.map((hall) => (
          <li key={hall.id}>
            <input
              type="radio"
              className="conf-step__radio"
              name="chairs-hall"
              checked={selectedHallId === hall.id}
              onChange={() => setSelectedHallId(hall.id)}
            />
            <span className="conf-step__selector">{hall.name}</span>
          </li>
        ))}
      </ul>

      <p className="conf-step__paragraph">Укажите количество рядов и максимальное количество кресел в ряду:</p>
      <div className="conf-step__legend">
        <label className="conf-step__label">
          Рядов, шт
          <input className="conf-step__input" value={layoutRows} onChange={(e) => setLayoutRows(e.target.value)} />
        </label>
        <span className="multiplier">x</span>
        <label className="conf-step__label">
          Мест, шт
          <input className="conf-step__input" value={layoutCols} onChange={(e) => setLayoutCols(e.target.value)} />
        </label>
        <button type="button" className="conf-step__button conf-step__button-regular" onClick={applyGridSize}>
          Применить размер
        </button>
      </div>

      <p className="conf-step__paragraph">Теперь вы можете указать типы кресел на схеме зала:</p>
      <div className="conf-step__legend">
        <span className="conf-step__chair conf-step__chair_standart" /> — обычные кресла
        <span className="conf-step__chair conf-step__chair_vip" /> — VIP кресла
        <span className="conf-step__chair conf-step__chair_disabled" /> — заблокированные (нет кресла)
        <p className="conf-step__hint">Чтобы изменить вид кресла, нажмите по нему левой кнопкой мыши</p>
      </div>

      <SeatGrid
        layout={layout}
        mode="admin-config"
        onSeatClick={(row, seat, type) => {
          setLayout((current) => current.map((layoutRow, rowIndex) =>
            layoutRow.map((cell, seatIndex) => {
              if (rowIndex === row && seatIndex === seat) {
                return nextSeatType(type);
              }
              return cell;
            }),
          ));
        }}
      />

      <fieldset className="conf-step__buttons text-center">
        <button type="button" className="conf-step__button conf-step__button-accent" onClick={saveLayout}>
          Сохранить
        </button>
      </fieldset>
    </AccordionSection>
  );
}
