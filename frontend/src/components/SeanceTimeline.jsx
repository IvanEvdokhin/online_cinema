export default function SeanceTimeline({ halls, onDeleteSeance }) {
  const minutesInDay = 24 * 60;
  const pixelsPerMinute = 1;

  return (
    <div className="conf-step__seances">
      {halls.map((hall) => (
        <div className="conf-step__seances-hall" key={hall.hall_id}>
          <h3 className="conf-step__seances-title">{hall.hall_name}</h3>
          <div className="conf-step__seances-timeline">
            {hall.seances.map((seance) => (
              <div
                key={seance.id}
                className="conf-step__seances-movie"
                style={{
                  width: `${Math.max(seance.duration * pixelsPerMinute, 60)}px`,
                  left: `${seance.start_minutes * pixelsPerMinute}px`,
                  backgroundColor: seance.movie_id % 2 === 0 ? 'rgb(133, 255, 137)' : 'rgb(202, 255, 133)',
                }}
              >
                <p className="conf-step__seances-movie-title">{seance.movie_title}</p>
                <p className="conf-step__seances-movie-start">{seance.start_time}</p>
                {onDeleteSeance && (
                  <button
                    type="button"
                    className="conf-step__button conf-step__button-trash trash-seance"
                    aria-label="Удалить сеанс"
                    onClick={() => onDeleteSeance(seance)}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
