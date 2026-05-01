import { useEffect, useMemo, useState } from 'react';
import { useApp } from '../../app/providers';
import { FolderSidebar } from './FolderSidebar';
import { FolderTaskCard } from './FolderTaskCard';
import type { Task, TaskStatus } from '../../entities/task/model/types';

type ViewMode = 'current' | 'kanban' | 'list';

const COLUMNS: { key: TaskStatus; label: string; modifier: string }[] = [
  { key: 'todo', label: 'TO DO', modifier: 'todo' },
  { key: 'in_progress', label: 'IN PROGRESS', modifier: 'in-progress' },
  { key: 'done', label: 'DONE', modifier: 'done' },
];

const STATUS_LABELS: Record<TaskStatus, string> = {
  todo: 'TO DO',
  in_progress: 'IN PROGRESS',
  done: 'DONE',
};

export function FolderBoard() {
  const { folders, tasks, toggleTask, addTask } = useApp();

  const [selectedFolderId, setSelectedFolderId] = useState<number>(
    folders[0]?.id ?? 0,
  );
  const [viewMode, setViewMode] = useState<ViewMode>('kanban');

  // Keep selection valid if folder list changes
  useEffect(() => {
    if (!folders.find((f) => f.id === selectedFolderId)) {
      setSelectedFolderId(folders[0]?.id ?? 0);
    }
  }, [folders, selectedFolderId]);

  const selectedFolder = useMemo(
    () => folders.find((f) => f.id === selectedFolderId) ?? folders[0],
    [folders, selectedFolderId],
  );

  const folderTasks = useMemo(
    () => tasks.filter((t) => t.folderId === selectedFolderId),
    [tasks, selectedFolderId],
  );

  const doneCount = folderTasks.filter((t) => t.status === 'done').length;
  const openCount = folderTasks.length - doneCount;

  const handleAddTask = (status: TaskStatus = 'todo') => {
    if (!selectedFolder) return;
    const title = window.prompt('Task title:');
    if (!title || !title.trim()) return;
    addTask({ folderId: selectedFolder.id, title: title.trim(), status });
  };

  if (!selectedFolder) {
    return (
      <section className="folder-board">
        <div className="folder-board-empty">
          <div className="folder-board-empty__title">No folders yet</div>
          <p className="folder-board-empty__text">Create a folder to start.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="folder-board">
      <FolderSidebar
        folders={folders}
        tasks={tasks}
        selectedFolderId={selectedFolder.id}
        onSelectFolder={setSelectedFolderId}
      />

      <main className="folder-board-main">
        <header className="folder-board-main__header">
          <div>
            <div className="folder-board-main__eyebrow">SELECTED FOLDER</div>

            <h1 className="folder-board-main__title">
              <span
                className="folder-board-main__dot"
                style={{ backgroundColor: selectedFolder.color }}
              />
              {selectedFolder.name}
            </h1>

            <p className="folder-board-main__summary">
              {openCount} open · {doneCount} done
            </p>
          </div>

          <div className="folder-board-main__actions">
            <button
              type="button"
              className="folder-board-add-task"
              onClick={() => handleAddTask('todo')}
            >
              + ADD TASK
            </button>

            <div className="folder-board-view-switch">
              {(['current', 'kanban', 'list'] as const).map((mode) => (
                <button
                  key={mode}
                  type="button"
                  className={`folder-board-view-switch__button ${
                    viewMode === mode
                      ? 'folder-board-view-switch__button--active'
                      : ''
                  }`}
                  onClick={() => setViewMode(mode)}
                >
                  {mode.toUpperCase()}
                </button>
              ))}
            </div>
          </div>
        </header>

        {viewMode === 'current' && (
          <CurrentView
            tasks={folderTasks.filter((t) => t.status === 'in_progress')}
            folderColor={selectedFolder.color}
          />
        )}

        {viewMode === 'kanban' && (
          <KanbanView
            tasks={folderTasks}
            onAddTask={handleAddTask}
            onToggleTask={toggleTask}
          />
        )}

        {viewMode === 'list' && (
          <ListView tasks={folderTasks} onToggleTask={toggleTask} />
        )}
      </main>
    </section>
  );
}

// ── Sub-views ──────────────────────────────────────────────────────

function CurrentView({
  tasks,
  folderColor,
}: {
  tasks: Task[];
  folderColor: string;
}) {
  return (
    <div className="folder-board-current">
      <div className="folder-board-current__label">IN PROGRESS TODAY</div>

      {tasks.length > 0 ? (
        <div className="folder-board-current__list">
          {tasks.map((t) => (
            <FolderTaskCard key={t.id} task={t} folderColor={folderColor} />
          ))}
        </div>
      ) : (
        <div className="folder-board-empty">
          <div className="folder-board-empty__title">No tasks in progress</div>
          <p className="folder-board-empty__text">
            Move a task to "in progress" or add a new one.
          </p>
        </div>
      )}
    </div>
  );
}

function KanbanView({
  tasks,
  onAddTask,
  onToggleTask,
}: {
  tasks: Task[];
  onAddTask: (status: TaskStatus) => void;
  onToggleTask: (id: number) => void;
}) {
  return (
    <div className="folder-board-kanban">
      {COLUMNS.map((col) => {
        const colTasks = tasks.filter((t) => t.status === col.key);
        return (
          <div
            key={col.key}
            className={`folder-board-kanban__col folder-board-kanban__col--${col.modifier}`}
          >
            <header className="folder-board-kanban__header">
              <span className="folder-board-kanban__label">{col.label}</span>
              <span className="folder-board-kanban__count">{colTasks.length}</span>
            </header>

            <div className="folder-board-kanban__list">
              {colTasks.map((t) => (
                <article
                  key={t.id}
                  className={`folder-board-kanban__card ${
                    t.status === 'done' ? 'is-done' : ''
                  }`}
                  onClick={() => onToggleTask(t.id)}
                >
                  <div className="folder-board-kanban__title">{t.title}</div>
                  <div className="folder-board-kanban__meta">
                    {t.tag && (
                      <span className="folder-board-tag">{t.tag}</span>
                    )}
                    {t.priority && (
                      <span
                        className={`folder-board-priority folder-board-priority--${t.priority.toLowerCase()}`}
                      >
                        {t.priority}
                      </span>
                    )}
                    {t.time && t.time !== '—' && (
                      <span className="folder-board-time">⏱ {t.time}</span>
                    )}
                  </div>
                </article>
              ))}
            </div>

            <button
              type="button"
              className="folder-board-kanban__add"
              onClick={() => onAddTask(col.key)}
            >
              + Add task
            </button>
          </div>
        );
      })}
    </div>
  );
}

function ListView({
  tasks,
  onToggleTask,
}: {
  tasks: Task[];
  onToggleTask: (id: number) => void;
}) {
  if (tasks.length === 0) {
    return (
      <div className="folder-board-empty">
        <div className="folder-board-empty__title">No tasks yet</div>
        <p className="folder-board-empty__text">
          Click + ADD TASK to create one.
        </p>
      </div>
    );
  }

  return (
    <div className="folder-board-list">
      {tasks.map((t) => {
        const isDone = t.status === 'done';
        return (
          <div
            key={t.id}
            className={`folder-board-list__row ${isDone ? 'is-done' : ''}`}
          >
            <button
              type="button"
              className={`folder-board-list__check ${isDone ? 'is-checked' : ''}`}
              onClick={() => onToggleTask(t.id)}
              aria-label={isDone ? 'Mark as not done' : 'Mark as done'}
            >
              {isDone ? '✓' : ''}
            </button>

            <span className="folder-board-list__title">{t.title}</span>

            {t.priority && (
              <span
                className={`folder-board-priority folder-board-priority--${t.priority.toLowerCase()}`}
              >
                {t.priority}
              </span>
            )}
            {t.time && t.time !== '—' && (
              <span className="folder-board-time">⏱ {t.time}</span>
            )}
            <span className="folder-board-list__status">
              {STATUS_LABELS[t.status]}
            </span>
          </div>
        );
      })}
    </div>
  );
}