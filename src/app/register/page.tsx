import { AuthView } from "@/features/auth/views";
import type { AuthMode } from "@/features/auth/types/auth-view.types";

type RegisterPageProps = {
  searchParams?: {
    mode?: string | string[];
  };
};

export default function RegisterPage({ searchParams }: RegisterPageProps) {
  const requestedMode = Array.isArray(searchParams?.mode)
    ? searchParams?.mode[0]
    : searchParams?.mode;

  const defaultMode: AuthMode = requestedMode === "login" ? "login" : "register";

  return <AuthView defaultMode={defaultMode} />;
}
