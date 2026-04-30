import { RestorePasswordForm } from '../../features/auth/restore-password-form';
import { AuthLayout } from '../../widgets/auth-layout';

export function RestorePasswordPage() {
  return (
    <AuthLayout>
      <RestorePasswordForm />
    </AuthLayout>
  );
}
