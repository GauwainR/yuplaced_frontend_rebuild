import { SignupForm } from '../../features/auth/signup-form';
import { AuthLayout } from '../../widgets/auth-layout';

export function SignupPage() {
  return (
    <AuthLayout>
      <SignupForm />
    </AuthLayout>
  );
}
