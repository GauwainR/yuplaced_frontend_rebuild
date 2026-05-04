import { useMemo, useState } from 'react';
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useDraggable,
  useDroppable,
  useSensor,
  useSensors,
  pointerWithin,
  type DragEndEvent,
  type DragStartEvent,
} from '@dnd-kit/core';
import { useApp } from '../../app/providers';
import { FolderSidebar, ALL_FOLDER_ID } from './FolderSidebar';
import { CreateTaskModal } from './CreateTaskModal';
import { CreateFolderModal } from './CreateFolderModal';
import { CompleteTaskModal } from './CompleteTaskModal';
import { TaskSidebar } from './TaskSidebar';
import type { Task, TaskStatus } from '../../entities/task/model/types';
import { fmtTracked } from '../../entities/task/model/types';

type ViewMode = 'kanban' | 'list';

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

const TAG_COLORS: Record<string, string> = {
  devops: 'pink',
  review: 'orange',
  docs: 'blue',
  backend: 'pink',
  algo: 'blue',
  lang: 'orange',
  feat: 'pink',
  design: 'blue',
  milestone: 'orange',
  frontend: 'blue',
  ai: 'orange',
};

export function FolderBoard() {
  const {
    folders, tasks, toggleTask, moveTask, updateTask,
    addTaskFull, addFolder, updateFolder, addTimeToTask, addValue,
  } = useApp();

  const [selectedFolderId, setSelectedFolderId] = useState<number>(ALL_FOLDER_ID);
  const [viewMode, setViewMode] = useState<ViewMode>('kanban');

  // Modals
  const [taskModalOpen, setTaskModalOpen] = useState(false);
  const [taskModalDefaultStatus, setTaskModalDefaultStatus] =
    useState<TaskStatus>('todo');
  const [folderModalOpen, setFolderModalOpen] = useState(false);
  const [editingFolder, setEditingFolder] = useState<typeof folders[0] | null>(null);

  // Task sidebar
  const [sidebarTask, setSidebarTask] = useState<Task | null>(null);

  // Complete-task modal: shown when a task transitions to 'done'
  const [pendingDoneTask, setPendingDoneTask] = useState<Task | null>(null);
  const [pendingDoneCallback, setPendingDoneCallback] = useState<(() => void) | null>(null);

  // ── Intercept handlers: show modal before marking done ────
  const handleToggle = (taskId: number) => {
    const task = tasks.find((t) => t.id === taskId);
    if (!task) return;
    if (task.status !== 'done') {
      // Going TO done → show modal
      setPendingDoneTask(task);
      setPendingDoneCallback(() => () => toggleTask(taskId));
    } else {
      // Un-doing → just toggle
      toggleTask(taskId);
    }
  };

  const handleMove = (taskId: number, newStatus: TaskStatus) => {
    const task = tasks.find((t) => t.id === taskId);
    if (!task) return;
    if (newStatus === 'done' && task.status !== 'done') {
      setPendingDoneTask(task);
      setPendingDoneCallback(() => () => moveTask(taskId, 'done'));
    } else {
      moveTask(taskId, newStatus);
    }
  };

  const handleSidebarUpdate = (updated: Task) => {
    const original = tasks.find((t) => t.id === updated.id);
    if (updated.status === 'done' && original && original.status !== 'done') {
      setPendingDoneTask(updated);
      setPendingDoneCallback(() => () => updateTask(updated));
      setSidebarTask(null);
    } else {
      updateTask(updated);
      setSidebarTask(null);
    }
  };

  const handleCompleteDone = (data: { minutes: number; value: string }) => {
    pendingDoneCallback?.();
    if (pendingDoneTask && data.minutes > 0) {
      addTimeToTask(pendingDoneTask.id, data.minutes);
    }
    if (data.value) {
      addValue(data.value);
    }
    setPendingDoneTask(null);
    setPendingDoneCallback(null);
  };

  const handleSkipDone = () => {
    pendingDoneCallback?.();
    setPendingDoneTask(null);
    setPendingDoneCallback(null);
  };

  // Resolve selected folder (real or ALL pseudo-folder)
  const isAllView = selectedFolderId === ALL_FOLDER_ID;

  const selectedFolder = useMemo(() => {
    if (isAllView) {
      return { id: ALL_FOLDER_ID, name: 'ALL', color: '#888', description: '' };
    }
    const found = folders.find((f) => f.id === selectedFolderId);
    if (!found && folders.length > 0) return folders[0];
    return found ?? null;
  }, [folders, selectedFolderId, isAllView]);

  // If a real folder was deleted, fall back to ALL
  const effectiveFolderId = selectedFolder?.id ?? ALL_FOLDER_ID;
  if (effectiveFolderId !== selectedFolderId && !isAllView) {
    // Can't call setState during render, but useMemo above already resolved it.
    // We just use effectiveFolderId below.
  }

  const folderTasks = useMemo(
    () =>
      isAllView
        ? tasks
        : tasks.filter((t) => t.folderId === effectiveFolderId),
    [tasks, effectiveFolderId, isAllView],
  );

  const doneCount = folderTasks.filter((t) => t.status === 'done').length;
  const openCount = folderTasks.length - doneCount;

  const openTaskModal = (status: TaskStatus = 'todo') => {
    setTaskModalDefaultStatus(status);
    setTaskModalOpen(true);
  };

  // For TaskSidebar — find the real folder of the task being edited
  const sidebarFolder = sidebarTask
    ? folders.find((f) => f.id === sidebarTask.folderId) ?? undefined
    : undefined;

  return (
    <section className="folder-board">
      <FolderSidebar
        folders={folders}
        tasks={tasks}
        selectedFolderId={selectedFolderId}
        onSelectFolder={setSelectedFolderId}
        onCreateFolder={() => {
          setEditingFolder(null);
          setFolderModalOpen(true);
        }}
        onEditFolder={(folder) => {
          setEditingFolder(folder);
          setFolderModalOpen(true);
        }}
      />

      <main className="folder-board-main">
        <header className="folder-board-main__header">
          <div>
            <div className="folder-board-main__eyebrow">SELECTED FOLDER</div>
            <h1 className="folder-board-main__title">
              {selectedFolder && (
                <span
                  className="folder-board-main__dot"
                  style={{ backgroundColor: selectedFolder.color }}
                />
              )}
              {selectedFolder?.name ?? 'ALL'}
            </h1>
            <p className="folder-board-main__summary">
              {openCount} open · {doneCount} done
            </p>
          </div>

          <div className="folder-board-main__actions">
            <button
              type="button"
              className="folder-board-add-task"
              onClick={() => openTaskModal('todo')}
            >
              + ADD TASK
            </button>
            <div className="folder-board-view-switch">
              {(['kanban', 'list'] as const).map((mode) => (
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

        {viewMode === 'kanban' && (
          <KanbanView
            tasks={folderTasks}
            folders={folders}
            isAllView={isAllView}
            onAddTask={openTaskModal}
            onMoveTask={handleMove}
            onOpenTask={setSidebarTask}
          />
        )}

        {viewMode === 'list' && (
          <ListView
            tasks={folderTasks}
            folders={folders}
            isAllView={isAllView}
            onToggleTask={handleToggle}
            onOpenTask={setSidebarTask}
          />
        )}
      </main>

      {/* Task detail sidebar */}
      {sidebarTask && (
        <TaskSidebar
          task={sidebarTask}
          folder={sidebarFolder}
          onClose={() => setSidebarTask(null)}
          onUpdate={handleSidebarUpdate}
        />
      )}

      <CreateTaskModal
        open={taskModalOpen}
        folders={folders}
        defaultFolderId={isAllView ? (folders[0]?.id ?? 0) : effectiveFolderId}
        defaultStatus={taskModalDefaultStatus}
        onClose={() => setTaskModalOpen(false)}
        onCreate={(input) => {
          addTaskFull(input);
          // If in ALL view, stay; otherwise switch to the task's folder
          if (!isAllView) setSelectedFolderId(input.folderId);
        }}
      />

      <CreateFolderModal
        open={folderModalOpen}
        onClose={() => {
          setFolderModalOpen(false);
          setEditingFolder(null);
        }}
        onCreate={(input) => addFolder(input)}
        editFolder={editingFolder}
        onUpdate={(id, patch) => updateFolder(id, patch)}
      />

      {/* Complete-task modal */}
      {pendingDoneTask && (
        <CompleteTaskModal
          task={pendingDoneTask}
          onSubmit={handleCompleteDone}
          onSkip={handleSkipDone}
        />
      )}
    </section>
  );
}

// ── KANBAN with DnD ─────────────────────────────────────────────

function KanbanView({
  tasks,
  folders,
  isAllView,
  onAddTask,
  onMoveTask,
  onOpenTask,
}: {
  tasks: Task[];
  folders: { id: number; color: string }[];
  isAllView: boolean;
  onAddTask: (status: TaskStatus) => void;
  onMoveTask: (id: number, newStatus: TaskStatus) => void;
  onOpenTask: (task: Task) => void;
}) {
  const [activeTask, setActiveTask] = useState<Task | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
  );

  const handleDragStart = (event: DragStartEvent) => {
    const task = event.active.data.current?.task as Task | undefined;
    setActiveTask(task ?? null);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveTask(null);
    const { active, over } = event;
    if (!over) return;
    const taskId = active.data.current?.task?.id as number | undefined;
    const newStatus = over.id as TaskStatus;
    if (!taskId || !newStatus) return;
    const currentStatus = active.data.current?.task?.status as TaskStatus | undefined;
    if (currentStatus === newStatus) return;
    onMoveTask(taskId, newStatus);
  };

  const folderColorMap = useMemo(() => {
    const map: Record<number, string> = {};
    folders.forEach((f) => { map[f.id] = f.color; });
    return map;
  }, [folders]);

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={pointerWithin}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="kanban-board">
        {COLUMNS.map((col) => {
          const colTasks = tasks.filter((t) => t.status === col.key);
          return (
            <KanbanColumn
              key={col.key}
              status={col.key}
              label={col.label}
              modifier={col.modifier}
              tasks={colTasks}
              folderColorMap={isAllView ? folderColorMap : null}
              onAddTask={() => onAddTask(col.key)}
              onOpenTask={onOpenTask}
              draggingId={activeTask?.id ?? null}
            />
          );
        })}
      </div>

      <DragOverlay dropAnimation={null}>
        {activeTask && (
          <KanbanCardGhost
            task={activeTask}
            folderColor={isAllView ? folderColorMap[activeTask.folderId] : undefined}
          />
        )}
      </DragOverlay>
    </DndContext>
  );
}

function KanbanColumn({
  status,
  label,
  modifier,
  tasks,
  folderColorMap,
  onAddTask,
  onOpenTask,
  draggingId,
}: {
  status: TaskStatus;
  label: string;
  modifier: string;
  tasks: Task[];
  folderColorMap: Record<number, string> | null;
  onAddTask: () => void;
  onOpenTask: (task: Task) => void;
  draggingId: number | null;
}) {
  const { setNodeRef, isOver } = useDroppable({ id: status });

  return (
    <div
      ref={setNodeRef}
      className={[
        'kanban-col',
        isOver ? 'kanban-col--drag-over' : '',
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <div className={`kanban-col-header ${modifier}`}>
        <span>{label}</span>
        <span className="kanban-col-header__count">{tasks.length}</span>
      </div>

      {tasks.map((t) => (
        <DraggableCard
          key={t.id}
          task={t}
          folderColor={folderColorMap ? folderColorMap[t.folderId] : undefined}
          onOpen={onOpenTask}
          isDragging={t.id === draggingId}
        />
      ))}

      <button type="button" className="add-task-btn" onClick={onAddTask}>
        + Add task
      </button>
    </div>
  );
}

function DraggableCard({
  task,
  folderColor,
  onOpen,
  isDragging,
}: {
  task: Task;
  folderColor?: string;
  onOpen: (task: Task) => void;
  isDragging: boolean;
}) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: `task-${task.id}`,
    data: { task },
  });

  const style = transform
    ? { transform: `translate(${transform.x}px, ${transform.y}px)` }
    : undefined;

  const tagClass = task.tag ? TAG_COLORS[task.tag] ?? '' : '';

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className={`kanban-task ${isDragging ? 'is-dragging' : ''}`}
      style={style}
      onClick={() => onOpen(task)}
    >
      {folderColor && (
        <div
          className="kanban-task__folder-stripe"
          style={{ backgroundColor: folderColor }}
        />
      )}
      <div className="kanban-task__top">
        <div className="kanban-task-title">{task.title}</div>
        <button
          type="button"
          className="kanban-task__menu"
          onClick={(e) => {
            e.stopPropagation();
            onOpen(task);
          }}
          onPointerDown={(e) => e.stopPropagation()}
          aria-label="Open task details"
        >
          ☰
        </button>
      </div>
      {task.comment && (
        <div className="kanban-task__comment">{task.comment}</div>
      )}
      <div className="kanban-task-meta">
        {task.tag && (
          <span className={`task-tag ${tagClass}`}>{task.tag}</span>
        )}
        <span className={`priority-badge ${task.priority.toLowerCase()}`}>
          {task.priority}
        </span>
        {task.trackedMin > 0 && (
          <span className="task-tag time-est">⏱ {fmtTracked(task.trackedMin)}</span>
        )}
      </div>
    </div>
  );
}

function KanbanCardGhost({ task, folderColor }: { task: Task; folderColor?: string }) {
  const tagClass = task.tag ? TAG_COLORS[task.tag] ?? '' : '';
  return (
    <div className="kanban-task kanban-task--overlay">
      {folderColor && (
        <div
          className="kanban-task__folder-stripe"
          style={{ backgroundColor: folderColor }}
        />
      )}
      <div className="kanban-task__top">
        <div className="kanban-task-title">{task.title}</div>
      </div>
      {task.comment && (
        <div className="kanban-task__comment">{task.comment}</div>
      )}
      <div className="kanban-task-meta">
        {task.tag && <span className={`task-tag ${tagClass}`}>{task.tag}</span>}
        <span className={`priority-badge ${task.priority.toLowerCase()}`}>
          {task.priority}
        </span>
        {task.trackedMin > 0 && (
          <span className="task-tag time-est">⏱ {fmtTracked(task.trackedMin)}</span>
        )}
      </div>
    </div>
  );
}

// ── LIST view ───────────────────────────────────────────────────

function ListView({
  tasks,
  folders,
  isAllView,
  onToggleTask,
  onOpenTask,
}: {
  tasks: Task[];
  folders: { id: number; color: string }[];
  isAllView: boolean;
  onToggleTask: (id: number) => void;
  onOpenTask: (task: Task) => void;
}) {
  const folderColorMap = useMemo(() => {
    const map: Record<number, string> = {};
    folders.forEach((f) => { map[f.id] = f.color; });
    return map;
  }, [folders]);

  if (tasks.length === 0) {
    return (
      <div className="folder-board-empty">
        <div className="folder-board-empty__title">No tasks yet</div>
        <p className="folder-board-empty__text">Click + ADD TASK to create one.</p>
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
            {isAllView && (
              <span
                className="folder-board-list__folder-dot"
                style={{ backgroundColor: folderColorMap[t.folderId] ?? '#888' }}
              />
            )}
            <div
              className={`task-checkbox ${isDone ? 'done' : ''}`}
              onClick={() => onToggleTask(t.id)}
            >
              {isDone ? '✓' : ''}
            </div>
            <span className={`task-list-title ${isDone ? 'done' : ''}`}>
              {t.title}
            </span>
            <span className={`priority-badge ${t.priority.toLowerCase()}`}>
              {t.priority}
            </span>
            {t.trackedMin > 0 && (
              <span className="task-tag time-est">⏱ {fmtTracked(t.trackedMin)}</span>
            )}
            <span className="folder-board-list__status">
              {STATUS_LABELS[t.status]}
            </span>
            <button
              type="button"
              className="folder-board-list__menu"
              onClick={() => onOpenTask(t)}
              aria-label="Open task details"
            >
              ☰
            </button>
          </div>
        );
      })}
    </div>
  );
}
