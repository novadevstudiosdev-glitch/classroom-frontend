"use client";

import Image from "next/image";
import { motion } from "motion/react";
import { BookOpen, Star, User } from "lucide-react";

const ASTRONAUTS = [
  {
    src: "/astronauta-verde.svg",
    alt: "Astronauta verde",
    width: 240,
    height: 250,
    imageClass: "w-[214px] xl:w-[236px]",
    bubble: "",
    bubbleAlign: "left",
    eyeDelay: 0,
  },
  {
    src: "/astronauta-celeste.svg",
    alt: "Astronauta celeste",
    width: 240,
    height: 250,
    imageClass: "w-[190px] xl:w-[210px]",
    bubble: "Hola!",
    bubbleAlign: "center",
    eyeDelay: 0.35,
  },
  {
    src: "/astronauta-morado.svg",
    alt: "Astronauta morado",
    width: 240,
    height: 250,
    imageClass: "w-[200px] xl:w-[220px]",
    bubble: "",
    bubbleAlign: "right",
    eyeDelay: 0.7,
  },
] as const;

function getBubblePosition(align: "left" | "center" | "right") {
  if (align === "left") return "left-6";
  if (align === "center") return "left-1/2 -translate-x-1/2";
  return "right-6";
}

function AstronautEyes({ delay = 0 }: { delay?: number }) {
  return (
    <div className="pointer-events-none absolute left-1/2 top-[35%] -translate-x-1/2 flex items-center gap-[18px]">
      <motion.span
        animate={{ x: [0, 1.4, -1.2, 0], y: [0, 0.4, 0, -0.2, 0] }}
        transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut", delay }}
        className="h-[7px] w-[7px] rounded-full bg-[#F4F9FF]"
      />
      <motion.span
        animate={{ x: [0, 1.4, -1.2, 0], y: [0, 0.4, 0, -0.2, 0] }}
        transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut", delay }}
        className="h-[7px] w-[7px] rounded-full bg-[#F4F9FF]"
      />
    </div>
  );
}

export function AuthHero() {
  return (
    <motion.div
      initial={{ opacity: 0, x: -40 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.7 }}
      className="hidden lg:flex flex-col justify-center max-h-[calc(100vh-44px)] gap-4 xl:gap-5 px-3 xl:px-4"
    >
      <div>
        <motion.div
          id="auth-logo-anchor"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", delay: 0.15 }}
          className="inline-flex items-center mb-6 cursor-pointer select-none"
        >
          <Image
            src="/NOVI.png"
            alt="NOVI"
            width={340}
            height={120}
            priority
            className="h-16 xl:h-20 w-auto object-contain drop-shadow-[0_8px_20px_rgba(0,0,0,0.4)]"
          />
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="text-4xl xl:text-[2.8rem] font-black text-slate-100 leading-tight mb-3"
        >
          Aprender nunca fue tan{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-300 to-violet-300">
            divertido
          </span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
          className="text-lg xl:text-xl leading-relaxed text-slate-300 max-w-[34ch]"
        >
          Unete a miles de estudiantes que estan descubriendo un nuevo mundo de
          conocimiento a traves del juego.
        </motion.p>
      </div>

      <div className="relative mt-0.5 max-w-[700px] overflow-visible">
        <div className="absolute inset-x-0 bottom-1 h-28 rounded-[40px] bg-gradient-to-t from-indigo-500/12 to-transparent blur-2xl" />
        <div className="relative flex items-end justify-start gap-2 xl:gap-4">
          {ASTRONAUTS.map((astronaut) => {
            return (
              <div
                key={astronaut.src}
                className="relative opacity-100 drop-shadow-[0_18px_34px_rgba(7,18,57,0.46)]"
              >
                {astronaut.bubble ? (
                  <span
                    className={`absolute -top-3 ${getBubblePosition(
                      astronaut.bubbleAlign
                    )} rounded-full border border-white/45 bg-white/96 px-2.5 py-1 text-[11px] font-extrabold text-slate-800 shadow-md`}
                  >
                    {astronaut.bubble}
                  </span>
                ) : null}

                <AstronautEyes delay={astronaut.eyeDelay} />

                <Image
                  src={astronaut.src}
                  alt={astronaut.alt}
                  width={astronaut.width}
                  height={astronaut.height}
                  className={`h-auto object-contain select-none ${astronaut.imageClass}`}
                />
              </div>
            );
          })}
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.05 }}
        className="flex items-center gap-3"
      >
        <div className="flex items-center gap-2 bg-white/90 backdrop-blur-sm px-3 py-2.5 rounded-2xl shadow-sm border border-white/70">
          <div className="w-9 h-9 bg-blue-100 rounded-xl flex items-center justify-center">
            <User className="text-blue-600" size={18} />
          </div>
          <div>
            <p className="text-xl font-bold text-slate-800">50K+</p>
            <p className="text-xs text-slate-500">Estudiantes</p>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-white/90 backdrop-blur-sm px-3 py-2.5 rounded-2xl shadow-sm border border-white/70">
          <div className="w-9 h-9 bg-purple-100 rounded-xl flex items-center justify-center">
            <BookOpen className="text-purple-600" size={18} />
          </div>
          <div>
            <p className="text-xl font-bold text-slate-800">1000+</p>
            <p className="text-xs text-slate-500">Lecciones</p>
          </div>
        </div>

        <div className="hidden xl:flex items-center gap-2 bg-white/90 backdrop-blur-sm px-3 py-2.5 rounded-2xl shadow-sm border border-white/70">
          <div className="w-9 h-9 bg-yellow-100 rounded-xl flex items-center justify-center">
            <Star className="text-yellow-600" size={18} />
          </div>
          <div>
            <p className="text-xl font-bold text-slate-800">4.9</p>
            <p className="text-xs text-slate-500">Calificacion</p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
