import type { ReactNode } from 'react';
import '@/styles/auth-reset.css';

type RegisterLayoutProps = {
  children: ReactNode;
};

export default function RegisterLayout({ children }: RegisterLayoutProps) {
  return <>{children}</>;
}
