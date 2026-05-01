import { useApp } from '../../app/providers';
import { AccountSection } from './AccountSection';
import { AppearanceSection } from './AppearanceSection';
import { ProfileSection } from './ProfileSection';
import { StatsSection } from './StatsSection';
import { ThemePreview } from './ThemePreview';

export function SettingsWithContext() {
  const { settings } = useApp();

  return (
    <div className="settings-shell">
      <main className="settings-main">
        <ProfileSection settings={settings} />
        <AppearanceSection settings={settings} />
        <StatsSection settings={settings} />
        <AccountSection />
      </main>

      <aside className="settings-aside">
        <ThemePreview />
      </aside>
    </div>
  );
}