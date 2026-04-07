import { AuthView } from '@/features/auth/views';
import type { AuthMode } from '@/features/auth/types/auth-view.types';

type RegisterPageProps = {
  searchParams?: Promise<{
    mode?: string | string[];
  }>;
};

export default async function RegisterPage({ searchParams }: RegisterPageProps) {
  const resolvedSearchParams = await searchParams;
  const requestedMode = Array.isArray(resolvedSearchParams?.mode)
    ? resolvedSearchParams?.mode[0]
    : resolvedSearchParams?.mode;

  const defaultMode: AuthMode = requestedMode === 'login' ? 'login' : 'register';

  return (
    <div id="auth-container">
      <AuthView defaultMode={defaultMode} />
    </div>
  );
}
