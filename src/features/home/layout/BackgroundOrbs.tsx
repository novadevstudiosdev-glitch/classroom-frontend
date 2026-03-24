'use client';

import { useState } from "react";

export function BackgroundOrbs() {
  const [stars] = useState(() =>
    Array.from({ length: 40 }).map(() => {
      const colors = ["#ffffff", "#c4b5fd", "#93c5fd", "#6ee7b7"];

      return {
        top: Math.random() * 100,
        left: Math.random() * 100,
        delay: Math.random() * 4,
        opacity: Math.random() * 0.6 + 0.6,
        size: Math.random() > 0.6 ? 2.5 : 1.5,
        color: colors[Math.floor(Math.random() * colors.length)],
      };
    })
  );

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
      {/* KEYFRAMES INLINE */}
      <style>
        {`
          @keyframes orbFloat {
            0%, 100% {
              transform: translateY(0px) scale(1);
              opacity: 0.15;
            }
            50% {
              transform: translateY(-30px) scale(1.1);
              opacity: 0.3;
            }
          }

          @keyframes twinkleMove {
            0% {
              transform: translate(0px, 0px);
              opacity: 0.4;
            }
            50% {
              transform: translate(6px, -12px);
              opacity: 1;
            }
            100% {
              transform: translate(0px, 0px);
              opacity: 0.4;
            }
          }
        `}
      </style>

      {/* 🌌 FONDO AZUL OSCURO */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#050816] via-[#0a0f2c] to-[#050816]" />

      {/* ORBES */}

      {/* Azul */}
      <div
        className="absolute w-[250px] h-[250px] md:w-[400px] md:h-[400px] rounded-full blur-3xl"
        style={{
          background:
            "radial-gradient(circle, rgba(48,84,255,0.4) 0%, transparent 70%)",
          top: "10%",
          left: "10%",
          animation: "orbFloat 6s ease-in-out infinite",
        }}
      />

      {/* Verde */}
      <div
        className="absolute w-[250px] h-[250px] md:w-[400px] md:h-[400px] rounded-full blur-3xl"
        style={{
          background:
            "radial-gradient(circle, rgba(0,125,21,0.4) 0%, transparent 70%)",
          top: "50%",
          right: "10%",
          animation: "orbFloat 6s ease-in-out infinite",
          animationDelay: "1s",
        }}
      />

      {/* Morado */}
      <div
        className="absolute w-[250px] h-[250px] md:w-[400px] md:h-[400px] rounded-full blur-3xl"
        style={{
          background:
            "radial-gradient(circle, rgba(139,103,255,0.4) 0%, transparent 70%)",
          bottom: "10%",
          left: "50%",
          animation: "orbFloat 6s ease-in-out infinite",
          animationDelay: "2s",
        }}
      />

      {/* Dorado */}
      <div
        className="absolute w-[250px] h-[250px] md:w-[400px] md:h-[400px] rounded-full blur-3xl"
        style={{
          background:
            "radial-gradient(circle, rgba(255,208,0,0.3) 0%, transparent 70%)",
          top: "30%",
          right: "30%",
          animation: "orbFloat 6s ease-in-out infinite",
          animationDelay: "1.5s",
        }}
      />

      {/* ✨ ESTRELLAS */}
      {stars.map((star, i) => (
        <div
          key={i}
          className="absolute rounded-full"
          style={{
            top: `${star.top}%`,
            left: `${star.left}%`,
            width: `${star.size}px`,
            height: `${star.size}px`,
            backgroundColor: star.color,
            opacity: star.opacity,
            animation: "twinkleMove 5s ease-in-out infinite",
            animationDelay: `${star.delay}s`,
            boxShadow: `0 0 ${star.size * 4}px ${star.color}`,
          }}
        />
      ))}
    </div>
  );
}