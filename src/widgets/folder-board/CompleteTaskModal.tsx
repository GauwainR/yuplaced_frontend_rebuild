import { useState } from 'react';
import { Modal } from '../../shared/ui/modal';
import type { Task } from '../../entities/task/model/types';

type Props = {
  task: Task;
  onSubmit: (data: { minutes: number; value: string }) => void;
  onSkip: () => void;
};

export function CompleteTaskModal({ task, onSubmit, onSkip }: Props) {
  const [hours, setHours] = useState('');
  const [minutes, setMinutes] = useState('');
  const [value, setValue] = useState('');

  const totalMin =
    (parseInt(hours, 10) || 0) * 60 + (parseInt(minutes, 10) || 0);

  const handleSubmit = () => {
    onSubmit({ minutes: totalMin, value: value.trim() });
  };

  return (
    <Modal
      open
      onClose={onSkip}
      title="TASK COMPLETED"
      width={440}
      footer={
        <>
          <button
            type="button"
            className="yn-modal-btn yn-modal-btn--ghost"
            onClick={onSkip}
          >
            SKIP
          </button>
          <button
            type="button"
            className="yn-modal-btn yn-modal-btn--primary"
            onClick={handleSubmit}
          >
            SAVE
          </button>
        </>
      }
    >
      {/* Task name */}
      <div className="complete-modal__task">
        <span className="complete-modal__check">✓</span>
        <span className="complete-modal__title">{task.title}</span>
      </div>

      {/* Time */}
      <div className="yn-modal-field">
        <div className="yn-modal-label">TIME SPENT</div>
        <div className="complete-modal__time-row">
          <div className="complete-modal__time-input">
            <input
              type="number"
              min="0"
              max="23"
              placeholder="0"
              value={hours}
              onChange={(e) => setHours(e.target.value)}
              className="yn-modal-input"
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSubmit();
              }}
            />
            <span className="complete-modal__time-unit">h</span>
          </div>
          <div className="complete-modal__time-input">
            <input
              type="number"
              min="0"
              max="59"
              placeholder="0"
              value={minutes}
              onChange={(e) => setMinutes(e.target.value)}
              className="yn-modal-input"
              autoFocus
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSubmit();
              }}
            />
            <span className="complete-modal__time-unit">m</span>
          </div>
        </div>
      </div>

      {/* Value */}
      <div className="yn-modal-field">
        <div className="yn-modal-label">VALUE / INSIGHT</div>
        <textarea
          className="yn-modal-textarea"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Что было ценного? Чему научился?"
          rows={3}
        />
      </div>
    </Modal>
  );
}
