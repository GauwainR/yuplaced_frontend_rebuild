export function ThemePreview() {
  return (
    <section className="settings-preview-card">
      <h2>THEME PREVIEW</h2>

      <div className="settings-preview">
        <div className="settings-preview__top">
          <span>● YUPLACED</span>
          <span>/ YUNOTE</span>
          <span>G</span>
        </div>

        <div className="settings-preview__tabs">
          <span>OVERVIEW</span>
          <span>FOLDERS</span>
          <span>DAILY</span>
        </div>

        <div className="settings-preview__box">
          <strong>TODAY FOCUS</strong>
          <span>☑ Review PR</span>
          <span>☐ CI/CD setup</span>
        </div>

        <div className="settings-preview__footer">
          <span />
          <span />
          <span />
          <strong />
        </div>
      </div>
    </section>
  );
}
