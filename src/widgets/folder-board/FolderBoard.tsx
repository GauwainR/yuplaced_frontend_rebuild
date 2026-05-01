import { useMemo, useState } from 'react';
import { useApp } from '../../app/providers';
import { FolderSidebar } from './FolderSidebar';
import { FolderTaskCard } from './FolderTaskCard';

type ViewMode = 'current' | 'kanban' | 'list';

export function FolderBoard() {
  const { folders, tasks } = useApp();

  const [selectedFolderId, setSelectedFolderId] = useState(folders[0]?.id ?? 1);
  const [viewMode, setViewMode] = useState<ViewMode>('current');

  const selectedFolder = useMemo(
    () => folders.find((folder) => folder.id === selectedFolderId) ?? folders[0],
    [selectedFolderId, folders]
  );

  const folderTasks = useMemo(
    () => tasks.filter((task) => task.folderId === selectedFolderId),
    [selectedFolderId, tasks]
  );

  const doneCount = folderTasks.filter((task) => task.status === 'done').length;
  const openCount = folderTasks.length - doneCount;

  if (!selectedFolder) {
    return null;
  }

  return (
    <section className="folder-board">
      <FolderSidebar
        folders={folders}
        tasks={tasks}
        selectedFolderId={selectedFolderId}
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

          <div className="folder-board-view-switch">
            {(['current', 'kanban', 'list'] as const).map((mode) => (
              <button
                key={mode}
                type="button"
                className={`folder-board-view-switch__button ${
                  viewMode === mode ? 'folder-board-view-switch__button--active' : ''
                }`}
                onClick={() => setViewMode(mode)}
              >
                {mode.toUpperCase()}
              </button>
            ))}
          </div>
        </header>

        {viewMode === 'current' && (
          <div className="folder-board-current">
            <div className="folder-board-current__label">CURRENT TASKS</div>

            {folderTasks.length > 0 ? (
              <div className="folder-board-current__list">
                {folderTasks.map((task) => (
                  <FolderTaskCard key={task.id} task={task} />
                ))}
              </div>
            ) : (
              <div className="folder-board-empty">
                <div className="folder-board-empty__title">No tasks yet</div>
                <p className="folder-board-empty__text">
                  Add the first task to start building your day flow.
                </p>
              </div>
            )}
          </div>
        )}

        {viewMode === 'kanban' && (
          <div className="folder-board-placeholder">
            KANBAN mode will be added in Step 7.1
          </div>
        )}

        {viewMode === 'list' && (
          <div className="folder-board-placeholder">
            LIST mode will be added after base task model is stable
          </div>
        )}
      </main>
    </section>
  );
}
