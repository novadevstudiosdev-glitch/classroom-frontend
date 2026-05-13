'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { createPortal } from 'react-dom';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/auth/auth.store';

export default function Navbar() {
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuthStore();
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setOpen(false);
    router.push('/');
  };

  return (
    <header style={{ position: 'relative', zIndex: 50 }}>
      <nav className="flex items-center justify-between px-6 md:px-12 py-3">
        {/* LOGO */}
        <div className="flex items-center">
          <Image
            src="/NOVI.png"
            alt="Logo Novi"
            width={150}
            height={150}
            loading="eager"
            className="object-contain cursor-pointer h-10 w-auto"
            onClick={() => router.push('/')}
          />
        </div>

        {/* DERECHA */}
        <div style={{ position: 'relative' }}>
          {!isAuthenticated || !user ? (
            <Link href="/login">
              <button
                className="px-5 py-2 rounded-2xl text-white text-sm font-medium transition-all duration-300 hover:opacity-80"
                style={{
                  background: 'rgba(255,255,255,0.10)',
                  border: '1px solid rgba(255,255,255,0.22)',
                  backdropFilter: 'blur(8px)',
                  WebkitBackdropFilter: 'blur(8px)',
                }}
              >
                Iniciar sesión
              </button>
            </Link>
          ) : (
            <div className="flex items-center gap-3">
              <span className="text-white/70 text-sm hidden sm:block">{user.name}</span>

              {/* Avatar */}
              <button
                onClick={() => setOpen(!open)}
                className="w-9 h-9 rounded-full bg-indigo-500 flex items-center justify-center text-white font-bold text-sm hover:scale-105 transition"
              >
                {user.name?.[0]?.toUpperCase() ?? '?'}
              </button>

              {/* Dropdown — rendered via portal to escape backdrop-filter stacking context */}
              {open && typeof window !== 'undefined' && createPortal(
                <>
                  <div
                    style={{ position: 'fixed', inset: 0, zIndex: 9998 }}
                    onClick={() => setOpen(false)}
                  />
                  <div
                    style={{
                      position: 'fixed', right: 16, top: 52,
                      width: 176, zIndex: 9999,
                      background: '#0d1117',
                      border: '1px solid rgba(255,255,255,0.10)',
                      borderRadius: 12,
                      boxShadow: '0 8px 32px rgba(0,0,0,0.55)',
                      padding: '6px 0',
                    }}
                  >
                    <button
                      onClick={() => { router.push('/perfil'); setOpen(false); }}
                      style={{
                        width: '100%', textAlign: 'left',
                        padding: '8px 16px', fontSize: 14,
                        color: 'rgba(255,255,255,0.7)',
                        background: 'none', border: 'none',
                        cursor: 'pointer', fontFamily: 'inherit',
                      }}
                      onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.05)')}
                      onMouseLeave={e => (e.currentTarget.style.background = 'none')}
                    >
                      Mi perfil
                    </button>
                    <div style={{ margin: '4px 0', borderTop: '1px solid rgba(255,255,255,0.08)' }} />
                    <button
                      onClick={handleLogout}
                      style={{
                        width: '100%', textAlign: 'left',
                        padding: '8px 16px', fontSize: 14,
                        color: '#f87171',
                        background: 'none', border: 'none',
                        cursor: 'pointer', fontFamily: 'inherit',
                      }}
                      onMouseEnter={e => (e.currentTarget.style.background = 'rgba(239,68,68,0.08)')}
                      onMouseLeave={e => (e.currentTarget.style.background = 'none')}
                    >
                      Cerrar sesión
                    </button>
                  </div>
                </>,
                document.body
              )}
            </div>
          )}
        </div>
      </nav>
    </header>
  );
}
