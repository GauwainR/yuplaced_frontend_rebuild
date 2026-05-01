import { useApp } from '../../app/providers';

export function ValueSection({ value }) {
  const { updateValue } = useApp();

  return (
    <div>
      <h3>VALUE</h3>
      <textarea
        value={value}
        onChange={(e) => updateValue(e.target.value)}
        style={{ width: '100%', minHeight: 100 }}
      />
    </div>
  );
}