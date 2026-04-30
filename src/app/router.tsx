import { Navigate, Route, Routes } from 'react-router-dom';
import { RestorePasswordPage } from '../pages/auth/RestorePasswordPage';
import { LoginPage } from '../pages/auth/LoginPage';
import { SignupPage } from '../pages/auth/SignupPage';
import { LandingPage } from '../pages/landing/LandingPage';
import { YunoteOverviewPage } from '../pages/yunote/overview/YunoteOverviewPage';
import { YunotePlaceholderPage } from '../pages/yunote/placeholder/YunotePlaceholderPage';
import { YunoteLayout } from '../widgets/yunote-layout';
import { routes } from '../shared/config/routes';

export function AppRouter() {
  return (
    <Routes>
      <Route path={routes.landing} element={<LandingPage />} />
      <Route path={routes.login} element={<LoginPage />} />
      <Route path={routes.signup} element={<SignupPage />} />
      <Route path={routes.restorePassword} element={<RestorePasswordPage />} />

      <Route path={routes.yunoteRoot} element={<YunoteLayout />}>
        <Route index element={<Navigate to={routes.yunoteOverview} replace />} />
        <Route path="overview" element={<YunoteOverviewPage />} />
        <Route path="folders" element={<YunotePlaceholderPage title="FOLDERS" />} />
        <Route path="daily-report" element={<YunotePlaceholderPage title="DAILY REPORT" />} />
        <Route path="pomodoro" element={<YunotePlaceholderPage title="POMODORO" />} />
        <Route path="settings" element={<YunotePlaceholderPage title="SETTINGS" />} />
      </Route>

      <Route path="/index.html" element={<Navigate to={routes.landing} replace />} />
      <Route path="/login.html" element={<Navigate to={routes.login} replace />} />
      <Route path="/signup.html" element={<Navigate to={routes.signup} replace />} />
      <Route path="/restore-password.html" element={<Navigate to={routes.restorePassword} replace />} />
      <Route path="/dashboard.html" element={<Navigate to={routes.yunoteOverview} replace />} />
      <Route path="/yunote.html" element={<Navigate to={routes.yunoteOverview} replace />} />

      <Route path="/legacy/pages/index.html" element={<Navigate to={routes.landing} replace />} />
      <Route path="/legacy/pages/login.html" element={<Navigate to={routes.login} replace />} />
      <Route path="/legacy/pages/signup.html" element={<Navigate to={routes.signup} replace />} />
      <Route path="/legacy/pages/restore-password.html" element={<Navigate to={routes.restorePassword} replace />} />
      <Route path="/legacy/pages/dashboard.html" element={<Navigate to={routes.yunoteOverview} replace />} />
      <Route path="/legacy/pages/yunote.html" element={<Navigate to={routes.yunoteOverview} replace />} />

      <Route path="*" element={<Navigate to={routes.landing} replace />} />
    </Routes>
  );
}
