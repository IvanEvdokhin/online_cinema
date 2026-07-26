import { nextSeatType, seatClassName, isSeatTaken, isSeatSelected } from '../utils/seats';

export default function SeatGrid({
  layout = [],
  mode = 'client',
  takenSeats = [],
  selectedSeats = [],
  onSeatClick,
  rowClassName = mode === 'client' ? 'buying-scheme__row' : 'conf-step__row',
  wrapperClassName = mode === 'client' ? 'buying-scheme__wrapper' : 'conf-step__hall-wrapper',
  containerClassName = mode === 'client' ? undefined : 'conf-step__hall',
}) {
  const content = (
    <div className={wrapperClassName}>
      {layout.map((row, rowIndex) => (
        <div className={rowClassName} key={rowIndex}>
          {row.map((type, seatIndex) => {
            const taken = isSeatTaken(takenSeats, rowIndex, seatIndex);
            const selected = isSeatSelected(selectedSeats, rowIndex, seatIndex);
            const clickable = mode === 'admin-config' || (mode === 'client' && type !== 'disabled' && !taken);

            return (
              <span
                key={`${rowIndex}-${seatIndex}`}
                className={seatClassName(type, mode, { selected, taken })}
                onClick={clickable ? () => onSeatClick?.(rowIndex, seatIndex, type) : undefined}
                role={clickable ? 'button' : undefined}
                tabIndex={clickable ? 0 : undefined}
              />
            );
          })}
        </div>
      ))}
    </div>
  );

  if (containerClassName) {
    return <div className={containerClassName}>{content}</div>;
  }

  return content;
}
