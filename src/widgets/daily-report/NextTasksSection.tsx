import type { NextTask } from '../../entities/day-report/model/types';

type Props = {
  tasks: NextTask[];
};

export function NextTasksSection({ tasks }: Props) {
  const regularTasks = tasks.filter((task) => !task.suggested);
  const suggestedTasks = tasks.filter((task) => task.suggested);

  return (
    <section className="daily-report-panel daily-report-panel--next">
      <header className="daily-report-panel__header">
        <h2>NEXT TASKS</h2>
        <button type="button">+</button>
      </header>

      <div className="daily-report-list">
        {regularTasks.map((task) => (
          <label key={task.id} className="daily-report-check-row">
            <span className="daily-report-checkbox" />
            <span>{task.title}</span>
          </label>
        ))}
      </div>

      <div className="daily-report-inline-input">Что дальше?</div>

      {suggestedTasks.length > 0 && (
        <div className="daily-report-suggested">
          <div className="daily-report-suggested__title">SUGGESTED</div>

          {suggestedTasks.map((task) => (
            <button key={task.id} type="button" className="daily-report-suggested__item">
              <span>→ {task.title}</span>
              <span>+</span>
            </button>
          ))}
        </div>
      )}
    </section>
  );
}
