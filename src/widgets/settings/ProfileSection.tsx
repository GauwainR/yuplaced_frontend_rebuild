import { useRef } from 'react';
import { useApp } from '../../app/providers';
import type { UserSettings } from '../../entities/settings/model/types';

type Props = {
  settings: UserSettings;
};

export function ProfileSection({ settings }: Props) {
  const { updateSettings } = useApp();
  const fileRef = useRef<HTMLInputElement | null>(null);

  const initial = settings.nickname.trim()[0]?.toUpperCase() ?? '?';

  const handleAvatarPick = () => {
    fileRef.current?.click();
  };

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!/\.(png|jpe?g)$/i.test(file.name)) {
      window.alert('Only PNG / JPG');
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      window.alert('Max 2MB');
      return;
    }
    // For now: just confirm. Real upload will be wired to backend.
    window.alert(`Selected: ${file.name}\n(Upload endpoint not wired yet)`);
    e.target.value = '';
  };

  return (
    <section className="settings-card">
      <h2>PROFILE</h2>

      <div className="settings-profile">
        <div
          className="settings-avatar"
          style={{
            borderColor: settings.accentColor,
            color: settings.accentColor,
          }}
        >
          {initial}
        </div>

        <div>
          <button
            type="button"
            className="settings-outline-button"
            onClick={handleAvatarPick}
          >
            Change avatar
          </button>
          <div className="settings-hint">PNG, JPG — max 2MB</div>
          <input
            ref={fileRef}
            type="file"
            accept="image/png,image/jpeg"
            style={{ display: 'none' }}
            onChange={handleFile}
          />
        </div>
      </div>

      <label className="settings-field">
        <span>NICKNAME</span>
        <input
          value={settings.nickname}
          onChange={(e) => updateSettings({ nickname: e.target.value })}
          placeholder="your_handle"
        />
      </label>
    </section>
  );
}
