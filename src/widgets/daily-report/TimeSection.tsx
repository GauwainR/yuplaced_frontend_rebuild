import { useApp } from '../../app/providers';
import type { DayReport } from '../../entities/day-report/model/types';

type Props = {
  time: DayReport['time'];
  open: boolean;
  onToggle: () => void;
};

export function TimeSection({ time, open, onToggle }: Props) {
  const { removeTimeEntry } = useApp();

  const handleRemove = (index: number) => {
    if (window.confirm('Remove this entry?')) {
      removeTimeEntry(index);
    }
  };

  return (
    <section className={`collapsible-section ${open ? 'expanded' : ''}`}>
      <header className="coll-header" onClick={onToggle}>
        <div className="coll-header__title">
          <span className="ds-label orange">TIME</span>
          {!open && <span className="coll-summary">{time.total}</span>}
        </div>
        <span className={`coll-chevron ${open ? 'open' : ''}`}>▾</span>
      </header>

      {open && (
        <div className="coll-body fade-in">
          <div className="time-total">{time.total}</div>

          {time.entries.length === 0 && (
            <div className="coll-empty">No time entries yet</div>
          )}

          {time.entries.map((entry, i) => (
            <button
              key={`${entry.label}-${i}`}
              type="button"
              className="time-entry-row"
              onClick={() => handleRemove(i)}
              title="Click to remove"
            >
              <span className="time-entry-row__label">{entry.label}</span>
              <span className="time-entry-row__val">{entry.duration}</span>
            </button>
          ))}
        </div>
      )}
    </section>
  );
}
