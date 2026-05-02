import type { Folder } from '../../entities/folder/model/types';
import type { Task } from '../../entities/task/model/types';

/** Sentinel id for the "All tasks" pseudo-folder. */
export const ALL_FOLDER_ID = 0;

type FolderSidebarProps = {
  folders: Folder[];
  tasks: Task[];
  selectedFolderId: number;
  onSelectFolder: (folderId: number) => void;
  onCreateFolder: () => void;
};

export function FolderSidebar({
  folders,
  tasks,
  selectedFolderId,
  onSelectFolder,
  onCreateFolder,
}: FolderSidebarProps) {
  const allActive = selectedFolderId === ALL_FOLDER_ID;

  return (
    <aside className="folder-board-sidebar">
      <div className="folder-board-sidebar__eyebrow">FOLDERS</div>

      <div className="folder-board-sidebar__list">
        {/* ALL pseudo-folder */}
        <button
          type="button"
          className={`folder-board-sidebar__item ${
            allActive ? 'folder-board-sidebar__item--active' : ''
          }`}
          onClick={() => onSelectFolder(ALL_FOLDER_ID)}
        >
          <span
            className="folder-board-sidebar__dot"
            style={{ backgroundColor: '#888' }}
          />
          <span className="folder-board-sidebar__name">ALL</span>
          <span className="folder-board-sidebar__count">{tasks.length}</span>
        </button>

        {/* Real folders */}
        {folders.map((folder) => {
          const isActive = folder.id === selectedFolderId;
          const taskCount = tasks.filter(
            (task) => task.folderId === folder.id,
          ).length;

          return (
            <button
              key={folder.id}
              type="button"
              className={`folder-board-sidebar__item ${
                isActive ? 'folder-board-sidebar__item--active' : ''
              }`}
              onClick={() => onSelectFolder(folder.id)}
            >
              <span
                className="folder-board-sidebar__dot"
                style={{ backgroundColor: folder.color }}
              />
              <span className="folder-board-sidebar__name">{folder.name}</span>
              <span className="folder-board-sidebar__count">{taskCount}</span>
            </button>
          );
        })}
      </div>

      <button
        type="button"
        className="folder-board-sidebar__new"
        onClick={onCreateFolder}
      >
        + NEW FOLDER
      </button>
    </aside>
  );
}
