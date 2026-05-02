import { useApp } from '../../app/providers';

type Props = {
  note: string;
  open: boolean;
  onToggle: () => void;
};

export function NoteSection({ note, open, onToggle }: Props) {
  const { updateNote } = useApp();

  const summary = note.trim() ? 'note saved' : '+ add note';

  return (
    <section className={`collapsible-section ${open ? 'expanded' : ''}`}>
      <header className="coll-header" onClick={onToggle}>
        <div className="coll-header__title">
          <span className="ds-label blue">NOTE</span>
          {!open && <span className="coll-summary">{summary}</span>}
        </div>
        <span className={`coll-chevron ${open ? 'open' : ''}`}>▾</span>
      </header>

      {open && (
        <div className="coll-body coll-body--note fade-in">
          <textarea
            className="note-area"
            value={note}
            onChange={(e) => updateNote(e.target.value)}
            placeholder="Quick thoughts, blockers, ideas…"
          />
        </div>
      )}
    </section>
  );
}
