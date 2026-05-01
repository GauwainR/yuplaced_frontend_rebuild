import type { UserSettings } from '../../entities/settings/model/types';

type Props = {
  settings: UserSettings;
};

export function ProfileSection({ settings }: Props) {
  return (
    <section className="settings-card">
      <h2>PROFILE</h2>

      <div className="settings-profile">
        <div className="settings-avatar">G</div>

        <div>
          <button type="button" className="settings-outline-button">
            Change avatar
          </button>
          <div className="settings-hint">PNG, JPG — max 2MB</div>
        </div>
      </div>

      <label className="settings-field">
        <span>NICKNAME</span>
        <input value={settings.nickname} readOnly />
      </label>
    </section>
  );
}
