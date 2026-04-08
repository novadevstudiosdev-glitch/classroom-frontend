'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
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
    <header className="top-0 left-0 w-full z-50">
      <nav className="flex items-center justify-between px-6 md:px-12 py-3 bg-transparent">
        {/* LOGO */}
        <div className="flex items-center">
          <Image src="/NOVI.png" alt="Logo Novi" width={150} height={150} loading="eager" className="object-contain cursor-pointer h-10 w-auto" onClick={() => router.push('/')} />
        </div>

        {/* DERECHA */}
        <div className="relative">
          {!isAuthenticated || !user ? (
            <Link href="/login">
              <button className="px-5 py-2 rounded-2xl border border-white/30 text-white backdrop-blur-md hover:bg-white/10 transition-all duration-300 text-sm">
                Iniciar sesión
              </button>
            </Link>
          ) : (
            <div className="flex items-center gap-3">
              <span className="text-white/70 text-sm hidden sm:block">{user.name}</span>

              {/* Avatar */}
              <button onClick={() => setOpen(!open)} className="w-9 h-9 rounded-full bg-indigo-500 flex items-center justify-center text-white font-bold text-sm hover:scale-105 transition">
                {user.name?.[0]?.toUpperCase() ?? '?'}
              </button>

              {/* Dropdown */}
              {open && (
                <div className="absolute right-0 top-11 w-44 bg-[#0d1117] border border-white/10 rounded-xl shadow-2xl py-1.5 z-50">
                  <button
                    onClick={() => {
                      router.push('/perfil');
                      setOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-white/70 hover:bg-white/5 hover:text-white transition-colors"
                  >
                    Mi perfil
                  </button>
                  <div className="my-1 border-t border-white/10" />
                  <button onClick={handleLogout} className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-red-500/10 transition-colors">
                    Cerrar sesión
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </nav>
    </header>
  );
}
