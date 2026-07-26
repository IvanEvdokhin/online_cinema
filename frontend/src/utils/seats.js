const CYCLE = ['disabled', 'standard', 'vip'];

export function nextSeatType(current) {
  const index = CYCLE.indexOf(current);
  return CYCLE[(index + 1) % CYCLE.length];
}

export function seatClassName(type, mode, { selected = false, taken = false } = {}) {
  if (mode === 'client') {
    if (type === 'disabled') return 'buying-scheme__chair buying-scheme__chair_disabled';
    if (taken) return 'buying-scheme__chair buying-scheme__chair_taken';
    if (selected) return 'buying-scheme__chair buying-scheme__chair_selected';
    if (type === 'vip') return 'buying-scheme__chair buying-scheme__chair_vip';
    return 'buying-scheme__chair buying-scheme__chair_standart';
  }

  if (type === 'disabled') return 'conf-step__chair conf-step__chair_disabled';
  if (type === 'vip') return 'conf-step__chair conf-step__chair_vip';
  return 'conf-step__chair conf-step__chair_standart';
}

export function isSeatTaken(takenSeats, row, seat) {
  return takenSeats.some((item) => item.row === row && item.seat === seat);
}

export function isSeatSelected(selectedSeats, row, seat) {
  return selectedSeats.some((item) => item.row === row && item.seat === seat);
}

export function toggleSeatSelection(selectedSeats, row, seat) {
  if (isSeatSelected(selectedSeats, row, seat)) {
    return selectedSeats.filter((item) => !(item.row === row && item.seat === seat));
  }
  return [...selectedSeats, { row, seat }];
}

export function calculateTotal(seats, layout, prices) {
  return seats.reduce((sum, { row, seat }) => {
    const type = layout?.[row]?.[seat];
    return sum + (prices?.[type] || 0);
  }, 0);
}

export function formatDateKey(date) {
  return date.toISOString().slice(0, 10);
}

export function addDays(date, days) {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

export const WEEKDAYS = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];
