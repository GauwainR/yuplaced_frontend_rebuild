import { useEffect, useState } from 'react';
import { Modal } from '../../shared/ui/modal';
import type { Folder } from '../../entities/folder/model/types';
import type { TaskPriority, TaskStatus } from '../../entities/task/model/types';

type Props = {
  open: boolean;
  folders: Folder[];
  defaultFolderId: number;
  defaultStatus?: TaskStatus;
  onClose: () => void;
  onCreate: (input: {
    folderId: number;
    title: string;
    priority: TaskPriority;
    comment: string;
    status: TaskStatus;
  }) => void;
};

const PRI_OPTIONS: { value: TaskPriority; label: string; color: string }[] = [
  { value: 'HIGH', label: 'HIGH', color: '#ff6b8a' },
  { value: 'MED', label: 'MED', color: '#facc15' },
  { value: 'LOW', label: 'LOW', color: '#41d6c3' },
];

export function CreateTaskModal({
  open,
  folders,
  defaultFolderId,
  defaultStatus = 'todo',
  onClose,
  onCreate,
}: Props) {
  const [title, setTitle] = useState('');
  const [priority, setPriority] = useState<TaskPriority>('MED');
  const [comment, setComment] = useState('');
  const [folderId, setFolderId] = useState<number>(defaultFolderId);
  const [status, setStatus] = useState<TaskStatus>(defaultStatus);

  // Reset form whenever the modal opens
  useEffect(() => {
    if (!open) return;
    setTitle('');
    setPriority('MED');
    setComment('');
    setFolderId(defaultFolderId);
    setStatus(defaultStatus);
  }, [open, defaultFolderId, defaultStatus]);

  const canSubmit = title.trim().length > 0;

  const handleCreate = () => {
    if (!canSubmit) return;
    onCreate({
      folderId,
      title: title.trim(),
      priority,
      comment: comment.trim(),
      status,
    });
    onClose();
  };

  const previewFolder = folders.find((f) => f.id === folderId);
  const previewPriority = PRI_OPTIONS.find((p) => p.value === priority)!;

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="NEW TASK"
      width={500}
      footer={
        <>
          <button
            type="button"
            className="yn-modal-btn yn-modal-btn--ghost"
            onClick={onClose}
          >
            CANCEL
          </button>
          <button
            type="button"
            className="yn-modal-btn yn-modal-btn--primary"
            onClick={handleCreate}
            disabled={!canSubmit}
          >
            CREATE
          </button>
        </>
      }
    >
      {/* Live preview chip */}
      <div className="yn-modal-preview">
        {previewFolder && (
          <span
            className="yn-modal-preview__dot"
            style={{ backgroundColor: previewFolder.color }}
          />
        )}
        <span
          className={`yn-modal-preview__title ${
            title ? '' : 'yn-modal-preview__title--placeholder'
          }`}
        >
          {title || 'TASK TITLE'}
        </span>
        <span
          className="yn-modal-preview__pri"
          style={{
            color: previewPriority.color,
            borderColor: previewPriority.color,
          }}
        >
          {previewPriority.label}
        </span>
      </div>

      {/* Title */}
      <div className="yn-modal-field">
        <div className="yn-modal-label">TITLE</div>
        <input
          className="yn-modal-input"
          autoFocus
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && canSubmit) handleCreate();
          }}
          placeholder="Task title…"
        />
      </div>

      {/* Priority */}
      <div className="yn-modal-field">
        <div className="yn-modal-label">PRIORITY</div>
        <div className="yn-modal-pri-row">
          {PRI_OPTIONS.map((p) => {
            const isActive = priority === p.value;
            return (
              <button
                key={p.value}
                type="button"
                className={`yn-modal-pri-btn ${isActive ? 'is-active' : ''}`}
                onClick={() => setPriority(p.value)}
                style={
                  isActive
                    ? {
                        background: `${p.color}1a`,
                        borderColor: p.color,
                        color: p.color,
                      }
                    : undefined
                }
              >
                {p.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Status */}
      <div className="yn-modal-field">
        <div className="yn-modal-label">STATUS</div>
        <div className="yn-modal-pri-row">
          {(['todo', 'in_progress', 'done'] as const).map((s) => {
            const labels: Record<TaskStatus, string> = {
              todo: 'TO DO',
              in_progress: 'IN PROGRESS',
              done: 'DONE',
            };
            const colors: Record<TaskStatus, string> = {
              todo: 'rgba(255,255,255,0.46)',
              in_progress: '#ff9f0a',
              done: '#35d46f',
            };
            const isActive = status === s;
            return (
              <button
                key={s}
                type="button"
                className={`yn-modal-pri-btn ${isActive ? 'is-active' : ''}`}
                onClick={() => setStatus(s)}
                style={
                  isActive
                    ? {
                        background: `${colors[s]}1a`,
                        borderColor: colors[s],
                        color: colors[s],
                      }
                    : undefined
                }
              >
                {labels[s]}
              </button>
            );
          })}
        </div>
      </div>

      {/* Folder */}
      {folders.length > 0 && (
        <div className="yn-modal-field">
          <div className="yn-modal-label">FOLDER</div>
          <div className="yn-modal-folder-list">
            {folders.map((f) => {
              const isActive = folderId === f.id;
              return (
                <button
                  key={f.id}
                  type="button"
                  className={`yn-modal-folder-btn ${isActive ? 'is-active' : ''}`}
                  onClick={() => setFolderId(f.id)}
                  style={
                    isActive
                      ? {
                          borderColor: f.color,
                          background: `${f.color}10`,
                        }
                      : undefined
                  }
                >
                  <span
                    className="yn-modal-folder-dot"
                    style={{ backgroundColor: f.color }}
                  />
                  <span className="yn-modal-folder-name">{f.name}</span>
                  {isActive && (
                    <span
                      className="yn-modal-folder-check"
                      style={{ color: f.color }}
                    >
                      ✓
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Comment */}
      <div className="yn-modal-field">
        <div className="yn-modal-label">COMMENT</div>
        <textarea
          className="yn-modal-textarea"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Notes, context, links…"
          rows={3}
        />
      </div>
    </Modal>
  );
}
