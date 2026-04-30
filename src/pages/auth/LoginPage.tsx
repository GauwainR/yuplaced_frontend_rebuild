import { LoginForm } from '../../features/auth/login-form';
import { AuthLayout } from '../../widgets/auth-layout';

export function LoginPage() {
  return (
    <AuthLayout>
      <LoginForm />
    </AuthLayout>
  );
}
