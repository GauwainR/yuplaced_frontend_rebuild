import { useApp } from '../../app/providers';
import type { UserSettings } from '../../entities/settings/model/types';

type Props = {
  settings: UserSettings;
};

export function AppearanceSection({ settings }: Props) {
  const { updateSettings } = useApp();

  return (
    <section className="settings-card">
      <h2>APPEARANCE</h2>

      <div className="settings-label">ACCENT COLOR</div>

      <div className="settings-accent-row">
        <input
          type="color"
          className="settings-color-input"
          value={settings.accentColor}
          onChange={(e) => updateSettings({ accentColor: e.target.value })}
          aria-label="Accent color"
        />
        <span>{settings.accentColor}</span>
      </div>

      <div className="settings-label">PRESETS</div>

      <div className="settings-preset-row">
        {settings.presets.map((color) => {
          const isActive =
            color.toLowerCase() === settings.accentColor.toLowerCase();
          return (
            <button
              key={color}
              type="button"
              className={`settings-preset ${isActive ? 'is-active' : ''}`}
              style={{ backgroundColor: color }}
              onClick={() => updateSettings({ accentColor: color })}
              aria-label={`Set accent color ${color}`}
            />
          );
        })}
      </div>
    </section>
  );
}