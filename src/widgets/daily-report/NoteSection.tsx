import { useApp } from '../../app/providers';

type Props = {
  note: string;
};

export function NoteSection({ note }: Props) {
  const { updateNote } = useApp();

  return (
    <section className="daily-report-panel daily-report-panel--note">
      <header className="daily-report-panel__header">
        <h2>NOTE</h2>
        <span className="daily-report-panel__hint">+ add note</span>
      </header>

      <textarea
        className="daily-report-note-area"
        value={note}
        onChange={(e) => updateNote(e.target.value)}
        placeholder="Quick thoughts, blockers, ideas…"
      />
    </section>
  );
}