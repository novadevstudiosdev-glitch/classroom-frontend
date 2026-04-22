"use client";
import { AuthBackgroundCanvas } from "@/features/auth/components/AuthBackgroundCanvas";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";

const NotFoundPage: React.FC = () => {
  const [seconds, setSeconds] = useState(10);

  useEffect(() => {
    if (seconds === 0) {
      window.location.href = "/";
      return;
    }

    const timer = setTimeout(() => {
      setSeconds((prev) => prev - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [seconds]);

  return (
    <div className="relative min-h-screen flex items-center justify-center text-white overflow-hidden mt-10 px-6 z-10">
      {/* ⭐ Fixed Background */}
      <div className="fixed inset-0 -z-10">
        <AuthBackgroundCanvas />
      </div>

      {/* 🚀 Main Content */}
      <div className="flex flex-col md:flex-row items-center justify-center gap-10 w-full max-w-5xl z-20">
        {/* 🚀 Rocket */}
        <div className="flex justify-center md:justify-start">
          <Image
            src="/Cohete-estrellado.png"
            alt="Cohete estrellado"
            width={400}
            height={400}
            quality={100}
            className="w-48 md:w-80 object-contain animate-fall"
          />
        </div>

        {/* 📄 Text Content */}
        <div className="text-center md:text-left max-w-md">
          <h2 className="text-6xl font-bold mb-4">404</h2>

          <h3 className="text-2xl font-semibold mb-4">
            Parece que esta misión no salió como esperábamos 💥
          </h3>

          <p className="text-gray-400 mb-6">
            La página que estás buscando se perdió en el espacio o nunca existió.
          </p>

          <p className="text-sm text-gray-300 mb-8">
            Te redirigimos al inicio en{" "}
            <span className="font-semibold text-indigo-400">{seconds}</span>{" "}
            segundos...
          </p>

          <Link
            href="/"
            className="inline-block bg-indigo-600 hover:bg-indigo-700 transition px-6 py-3 rounded-xl font-medium shadow-lg"
          >
            Ir ahora al inicio
          </Link>

          <div className="mt-10 mb-6 text-sm text-gray-500">
            Código de error: <span className=" text-red-400">MISSION_FAILED</span>
          </div>
        </div>
      </div>

      {/* Custom animations */}
      <style jsx>{`
        @keyframes fall {
          0% {
            transform: translateY(-200px) rotate(-20deg);
            opacity: 0;
          }
          60% {
            transform: translateY(20px) rotate(10deg);
            opacity: 1;
          }
          100% {
            transform: translateY(0) rotate(0deg);
          }
        }

        .animate-fall {
          animation: fall 1.5s ease-out;
        }

        @keyframes smoke {
          0% {
            transform: translateY(0) scale(1);
            opacity: 0.7;
          }
          100% {
            transform: translateY(-40px) scale(1.5);
            opacity: 0;
          }
        }

        .animate-smoke {
          animation: smoke 2s infinite ease-out;
        }
      `}</style>
    </div>
  );
};

export default NotFoundPage;