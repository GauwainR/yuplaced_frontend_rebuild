import type { ReactNode } from 'react';
import { BackgroundCanvas } from '../../shared/ui/BackgroundCanvas';
import { Nav } from '../../shared/ui/Nav';
import '../../styles/auth.css';

type AuthLayoutProps = {
  children: ReactNode;
};

export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="auth-page-shell">
      <BackgroundCanvas />
      <Nav variant="auth" />
      {children}
    </div>
  );
}
