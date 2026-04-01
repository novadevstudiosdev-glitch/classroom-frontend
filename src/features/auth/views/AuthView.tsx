"use client";

import { motion } from "motion/react";
import type { AuthMode } from "@/features/auth/types/auth-view.types";
import { AuthFormCard } from "@/features/auth/components/AuthFormCard";
import { AuthHero } from "@/features/auth/components/AuthHero";
import { AuthBackgroundCanvas } from "@/features/auth/components/AuthBackgroundCanvas";
import { AuthRocketOverlay } from "@/features/auth/components/AuthRocketOverlay";

type AuthViewProps = {
  defaultMode?: AuthMode;
};

export function AuthView({ defaultMode = "login" }: AuthViewProps) {
  return (
    <div className="min-h-screen bg-[#090f2a] flex items-center justify-center p-4 sm:p-6 lg:p-8 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <AuthBackgroundCanvas />

        <motion.div
          className="absolute -top-24 -left-20 w-lg h-lg bg-cyan-400/22 rounded-full blur-3xl"
          animate={{ y: [0, 24, 0], scale: [1, 1.08, 1] }}
          transition={{ duration: 9, repeat: Infinity }}
        />
        <motion.div
          className="absolute -bottom-24 -right-16 w-xl h-xl bg-violet-500/22 rounded-full blur-3xl"
          animate={{ y: [0, -30, 0], scale: [1, 1.12, 1] }}
          transition={{ duration: 11, repeat: Infinity }}
        />
        <motion.div
          className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[24rem] h-96 bg-indigo-500/18 rounded-full blur-3xl"
          animate={{ x: [0, 18, 0], y: [0, -16, 0] }}
          transition={{ duration: 12, repeat: Infinity }}
        />

        <motion.div
          className="absolute top-[12%] left-[8%] w-64 h-64 rounded-full border border-indigo-300/15"
          animate={{ scale: [0.9, 2.8], opacity: [0.5, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeOut" }}
        />
        <motion.div
          className="absolute bottom-[16%] right-[12%] w-52 h-52 rounded-full border border-pink-300/15"
          animate={{ scale: [0.9, 2.4], opacity: [0.45, 0] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeOut", delay: 2 }}
        />
        <motion.div
          className="absolute top-[10%] right-[30%] w-40 h-40 rounded-full border border-yellow-300/15"
          animate={{ scale: [0.9, 2.2], opacity: [0.45, 0] }}
          transition={{ duration: 6.5, repeat: Infinity, ease: "easeOut", delay: 4 }}
        />

        <div className="absolute inset-0 bg-linear-to-b from-transparent via-slate-950/20 to-slate-950/55" />
      </div>
      <AuthRocketOverlay anchorId="auth-logo-anchor" />

      <div className="w-full max-w-275 grid lg:grid-cols-[minmax(0,1fr)_minmax(0,0.9fr)] gap-8 xl:gap-10 items-center relative z-10">
        <AuthHero />
        <AuthFormCard defaultMode={defaultMode} />
      </div>
    </div>
  );
}
