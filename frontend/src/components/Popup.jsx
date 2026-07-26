export default function Popup({ title, onClose, children }) {
  return (
    <div className="popup active">
      <div className="popup__container">
        <div className="popup__content">
          <div className="popup__header">
            <h2 className="popup__title">
              {title}
              <button type="button" className="popup__dismiss" onClick={onClose} aria-label="Закрыть">
                ×
              </button>
            </h2>
          </div>
          <div className="popup__wrapper">{children}</div>
        </div>
      </div>
    </div>
  );
}
