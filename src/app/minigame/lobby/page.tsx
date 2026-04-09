'use client';
import { Suspense, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/auth/auth.store';
import { MinigameLobbyView } from '@/features/minigame/views/MinigameLobbyView';

function LobbyInner() {
  const router = useRouter();
  const { isAuthenticated, initialized, user } = useAuthStore();

  useEffect(() => {
    if (initialized && !isAuthenticated) {
      router.push('/login?redirect=/minigame/lobby');
    }
  }, [initialized, isAuthenticated, router]);

  if (!initialized || !isAuthenticated || !user) {
    return (
      <div style={{
        minHeight: '100vh', background: '#06080f',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: '#e2e8f0', fontFamily: "'Nunito', system-ui, sans-serif",
        fontSize: 18, fontWeight: 700, gap: 12,
      }}>
        <span style={{ fontSize: 28, animation: 'spin 1.2s linear infinite' }}>🚀</span>
        <span>Cargando...</span>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return <MinigameLobbyView />;
}

export default function LobbyPage() {
  return (
    <Suspense>
      <LobbyInner />
    </Suspense>
  );
}
