type Props = {
  items: string[];
};

export function DoneSection({ items }: Props) {
  return (
    <section className="daily-report-panel daily-report-panel--done">
      <header className="daily-report-panel__header">
        <h2>DONE</h2>
        <button type="button">+</button>
      </header>

      <div className="daily-report-list">
        {items.map((item) => (
          <label key={item} className="daily-report-check-row">
            <span className="daily-report-checkbox daily-report-checkbox--checked" />
            <span>{item}</span>
          </label>
        ))}
      </div>

      <div className="daily-report-inline-input">Что выполнено?</div>
    </section>
  );
}
