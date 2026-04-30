const folders = [
  {
    id: 1,
    name: 'РАБОТА',
    color: '#ff4f6d',
    count: 6,
    tasks: [
      { id: 1, title: 'Ревью PR от Саши', tag: 'review', priority: 'HIGH', time: '30m' },
      { id: 2, title: 'Оптимизация запросов БД', tag: 'backend', priority: 'MED', time: '2h' },
    ],
  },
];

export const FolderBoard = () => {
  return (
    <div className="yunote-folders-page">
      <aside className="yunote-folders-sidebar">
        <div className="sidebar-title">FOLDERS</div>

        {folders.map((folder) => (
          <button key={folder.id} className="folder-sidebar-item active">
            <span style={{ color: folder.color }}>●</span>
            <span>{folder.name}</span>
            <span>{folder.count}</span>
          </button>
        ))}

        <button className="new-folder-btn">+ NEW FOLDER</button>
      </aside>

      <main className="yunote-folders-main">
        <div className="folder-header">
          <div>
            <span style={{ color: folders[0].color }}>●</span>{' '}
            <strong>{folders[0].name}</strong>{' '}
            <span className="muted">4 open · 2 done</span>
          </div>

          <div className="view-switch">
            <button className="active">CURRENT</button>
            <button>KANBAN</button>
            <button>LIST</button>
          </div>
        </div>

        <div className="current-tasks">
          {folders[0].tasks.map((task) => (
            <div key={task.id} className="current-task-card">
              <div className="task-title">{task.title}</div>

              <div className="task-meta">
                <span className="task-tag">{task.tag}</span>
                <span className="task-priority">{task.priority}</span>
                <span className="task-time">◷ {task.time}</span>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};