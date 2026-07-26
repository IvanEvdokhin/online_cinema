import { addDays, formatDateKey, WEEKDAYS } from '../utils/seats';

export default function DayNavigator({ selectedDate, onChange, daysCount = 7 }) {
  const start = addDays(selectedDate, -3);

  return (
    <nav className="page-nav">
      {Array.from({ length: daysCount }).map((_, index) => {
        const date = addDays(start, index);
        const key = formatDateKey(date);
        const isSelected = key === formatDateKey(selectedDate);
        const isToday = key === formatDateKey(new Date());
        const isWeekend = date.getDay() === 0 || date.getDay() === 6;

        return (
          <button
            type="button"
            key={key}
            className={[
              'page-nav__day',
              isToday ? 'page-nav__day_today' : '',
              isSelected ? 'page-nav__day_chosen' : '',
              isWeekend ? 'page-nav__day_weekend' : '',
            ].filter(Boolean).join(' ')}
            onClick={() => onChange(date)}
          >
            <span className="page-nav__day-week">{WEEKDAYS[date.getDay()]}</span>
            <span className="page-nav__day-number">{date.getDate()}</span>
          </button>
        );
      })}
    </nav>
  );
}
