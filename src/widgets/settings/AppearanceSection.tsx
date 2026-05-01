import type { UserSettings } from '../../entities/settings/model/types';

type Props = {
  settings: UserSettings;
};

export function AppearanceSection({ settings }: Props) {
  return (
    <section className="settings-card">
      <h2>APPEARANCE</h2>

      <div className="settings-label">ACCENT COLOR</div>

      <div className="settings-accent-row">
        <span
          className="settings-current-color"
          style={{ backgroundColor: settings.accentColor }}
        />
        <span>{settings.accentColor}</span>
      </div>

      <div className="settings-label">PRESETS</div>

      <div className="settings-preset-row">
        {settings.presets.map((color) => (
          <button
            key={color}
            type="button"
            className="settings-preset"
            style={{ backgroundColor: color }}
          />
        ))}
      </div>
    </section>
  );
}
