export function AccountSection() {
  return (
    <section className="settings-card">
      <h2>ACCOUNT</h2>

      <div className="settings-account-actions">
        <button type="button" className="settings-outline-button">Export data</button>
        <button type="button" className="settings-outline-button">Import data</button>
        <button type="button" className="settings-danger-button">Delete account</button>
      </div>
    </section>
  );
}
