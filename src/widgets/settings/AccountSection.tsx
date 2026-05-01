import { useApp } from '../../app/providers';

export function AccountSection() {
  const { dayReport, settings } = useApp();

  const handleExport = () => {
    const payload = {
      version: 1,
      exportedAt: new Date().toISOString(),
      settings,
      dayReport,
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `yuplaced-export-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleImport = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'application/json';
    input.onchange = () => {
      const file = input.files?.[0];
      if (!file) return;
      window.alert(
        `Selected: ${file.name}\n(Import endpoint not wired yet — coming with backend integration)`,
      );
    };
    input.click();
  };

  const handleDelete = () => {
    if (
      window.confirm(
        'Delete account?\nThis action cannot be undone.\n(Delete endpoint not wired yet — coming with backend integration)',
      )
    ) {
      window.alert('Delete request acknowledged.');
    }
  };

  return (
    <section className="settings-card">
      <h2>ACCOUNT</h2>

      <div className="settings-account-actions">
        <button
          type="button"
          className="settings-outline-button"
          onClick={handleExport}
        >
          Export data
        </button>
        <button
          type="button"
          className="settings-outline-button"
          onClick={handleImport}
        >
          Import data
        </button>
        <button
          type="button"
          className="settings-danger-button"
          onClick={handleDelete}
        >
          Delete account
        </button>
      </div>
    </section>
  );
}