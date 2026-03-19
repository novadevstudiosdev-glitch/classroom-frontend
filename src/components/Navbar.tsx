"use client";

import Image from "next/image";

export default function Navbar() {
  return (
    <header className="fixed top-0 left-0 w-full z-50">
      <nav className="flex items-center justify-between px-6 md:px-12 py-4 bg-transparent">
        
        <div className="flex items-center">
          <Image
            src="/NOVI1.svg"
            alt="Logo Novi - classroom"
            width={150}
            height={150}
            className="object-contain"
          />
        </div>

        <div>
          <button className="px-5 py-2 rounded-2xl border border-white/30 text-white backdrop-blur-md hover:bg-white/10 transition-all duration-300">
            Iniciar sesión
          </button>
        </div>

      </nav>
    </header>
  );
}