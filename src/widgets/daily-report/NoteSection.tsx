import { useApp } from '../../app/providers';

export function NoteSection({ note }) {
  const { updateNote } = useApp();

  return (
    <div>
      <h3>NOTE</h3>
      <textarea
        value={note}
        onChange={(e) => updateNote(e.target.value)}
        style={{ width: '100%', minHeight: 100 }}
      />
    </div>
  );
}