import { useState } from 'react';

export default function AccordionSection({ title, defaultOpen = false, children }) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <section className="conf-step">
      <header
        className={`conf-step__header ${open ? 'conf-step__header_opened' : ''}`}
        onClick={() => setOpen((value) => !value)}
      >
        <h2 className="conf-step__title">{title}</h2>
      </header>
      {open && <div className="conf-step__wrapper">{children}</div>}
    </section>
  );
}
