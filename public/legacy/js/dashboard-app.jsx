/**
 * YUPLACED — Dashboard App
 * Root component, tab routing, accent colour, tweaks panel
 * Depends on: api.js, dashboard-data.js, dashboard-tabs.jsx, tweaks-panel.jsx
 */

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "accentColor": "#e040a0",
  "username": "..."
}/*EDITMODE-END*/;

function App() {
  const [tweaks, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const [tab, setTab]      = React.useState("overview");
  const [user, setUser]    = React.useState(null);
  const [stats, setStats]  = React.useState(null);
  const [days, setDays]    = React.useState([]);

  /* ── Загрузка данных при старте ── */
  React.useEffect(() => {
    // Профиль пользователя
    apiFetch('/users/me')
      .then(u => {
        setUser(u);
        setTweak('username', u.nickname);
      })
      .catch((err) => {
          console.error('Auth error:', err);
      });

    // Статистика YUNOTE
    Yunote.getStats().then(setStats).catch(console.error);

    // Последние дни
    Yunote.getDays().then(setDays).catch(console.error);
  }, []);

  /* Apply accent colour as CSS custom property */
  React.useEffect(() => {
    document.documentElement.style.setProperty("--pink",      tweaks.accentColor);
    document.documentElement.style.setProperty("--pink-lo",   tweaks.accentColor + "18");
    document.documentElement.style.setProperty("--pink-glow", tweaks.accentColor + "60");
  }, [tweaks.accentColor]);

  const flushTabs = ["folders", "daily"];

  return (
    <div style={{ height:"100vh", display:"flex", flexDirection:"column", overflow:"hidden" }}>

      {/* ── TOP BAR ── */}
      <div className="topbar">
        <div className="topbar-brand">
          <span className="root" style={{cursor:'pointer'}} onClick={() => window.location.href = 'index.html'}>YUPLACED</span>
          <span className="sep">/</span>
          <span className="current">DASHBOARD</span>
        </div>
        <div className="topbar-center">
          <span className="day-label-top">{new Date().toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'}).toUpperCase()}</span>
          <span className="today-badge">TODAY</span>
        </div>
        <div className="topbar-right" style={{display:'flex',alignItems:'center',gap:10}}>
          <button
            onClick={() => { Auth.logout(); }}
            style={{background:'none',border:'1px solid #333',color:'var(--muted)',fontFamily:'var(--mono)',fontSize:9,letterSpacing:2,padding:'4px 10px',cursor:'pointer'}}
          >
            LOG OUT
          </button>
          <div className="user-icon-btn" onClick={() => setTab("settings")} title="Settings">
            {tweaks.username[0]?.toUpperCase() || "?"}
          </div>
        </div>
      </div>

      {/* ── APP SHELL ── */}
      <div className="app-shell">

        {/* Tab bar */}
        <div className="tab-bar">
          {TABS.map(t => (
            <button
              key={t.id}
              className={`tab-item ${tab === t.id ? "active" : ""}`}
              onClick={() => setTab(t.id)}
            >
              {t.label}
              {t.count && <span className="tab-count">{t.count}</span>}
            </button>
          ))}
        </div>

        {/* Tab content */}
        <div className={`tab-content ${flushTabs.includes(tab) ? "flush" : ""}`}>
          {tab === "overview"  && <OverviewTab onTabChange={setTab} stats={stats} days={days} />}
          {tab === "folders"   && <FoldersTab />}
          {tab === "daily"     && <DailyReportTab days={days} />}
          {tab === "pomodoro"  && <PomodoroTab />}
          {tab === "settings"  && (
            <SettingsTab
              username={tweaks.username}
              accentColor={tweaks.accentColor}
              setTweak={setTweak}
              stats={stats}
              user={user}
            />
          )}
        </div>
      </div>

      {/* ── TWEAKS PANEL ── */}
      <TweaksPanel>
        <TweakSection title="Profile">
          <TweakText id="username" label="Nickname" />
        </TweakSection>
        <TweakSection title="Appearance">
          <TweakColor id="accentColor" label="Accent color" />
        </TweakSection>
      </TweaksPanel>

    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
