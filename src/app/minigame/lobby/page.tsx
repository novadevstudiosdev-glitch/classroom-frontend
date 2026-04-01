'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function LobbyPage() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      router.push('/login?redirect=/minigame/lobby');
      return;
    }

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const firstName: string = payload.first_name ?? '';
      const lastName: string = payload.last_name ?? '';
      const alias = [firstName, lastName].filter(Boolean).join(' ') || payload.email || 'Jugador';
      sessionStorage.setItem('novi_jwt', token);
      sessionStorage.setItem('novi_auto_alias', alias.slice(0, 24));
    } catch {
      router.push('/login?redirect=/minigame/lobby');
      return;
    }

    window.location.href = '/minigame/lobby.html';
  }, [router]);

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#06080f',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#e2e8f0',
        fontFamily: "'Nunito', system-ui, sans-serif",
        fontSize: '18px',
        fontWeight: 700,
        gap: '12px',
      }}
    >
      <span style={{ fontSize: '28px' }}>🚀</span>
      <span>Cargando lobby...</span>
    </div>
  );
}
