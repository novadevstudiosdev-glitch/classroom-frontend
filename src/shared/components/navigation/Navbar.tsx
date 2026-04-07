"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const router = useRouter();

  // null = no logueado
  const [user, setUser] = useState<{ name: string } | null>(null);
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    setUser(null);
    setOpen(false);
    router.push("/"); // redirige a la landing
  };

  return (
    <header className="top-0 left-0 w-full z-50">
      <nav className="flex items-center justify-between px-6 md:px-12 py-4 bg-transparent">
        
        {/* LOGO */}
        <div className="flex items-center">
          <Image
            src="/NOVI.png"
            alt="Logo Novi - classroom"
            width={150}
            height={150}
            className="object-contain cursor-pointer"
            onClick={() => router.push("/")}
          />
        </div>

        {/* DERECHA */}
        <div className="relative">
          {!user ? (
            <Link href="/register">
              <button className="px-5 py-2 rounded-2xl border border-white/30 text-white backdrop-blur-md hover:bg-white/10 transition-all duration-300">
                Iniciar sesión
              </button>
            </Link>
          ) : (
            <div className="flex items-center gap-3">
              <span className="text-white">
                Hola, {user.name}
              </span>

              {/* Avatar */}
              <button
                onClick={() => setOpen(!open)}
                className="w-10 h-10 rounded-full bg-purple-500 flex items-center justify-center text-white font-semibold hover:scale-105 transition"
              >
                {user.name[0]}
              </button>

              {/* DROPDOWN */}
              {open && (
                <div className="absolute right-0 top-12 w-48 bg-white rounded-xl shadow-lg py-2 text-black">
                  
                  <button
                    onClick={() => {
                      router.push("/perfil");
                      setOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100"
                  >
                    Mi perfil
                  </button>

                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100"
                  >
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