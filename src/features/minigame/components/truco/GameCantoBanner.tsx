"use client";

import { AnimatePresence, motion } from "motion/react";

interface Props {
  visible: boolean;
  text: string;
  actor?: string | null;
  responder?: string | null;
  waitingResponse?: boolean;
  tone?: "envido" | "truco" | "accept" | "reject" | "raise" | "neutral";
}

export default function GameCantoBanner({
  visible,
  text,
  actor,
  responder,
  waitingResponse = false,
  tone = "neutral",
}: Props) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key={`layer-${text}-${actor ?? "none"}-${waitingResponse ? "wait" : "nowait"}`}
          className="canto-banner-layer"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.16 }}
        >
          <motion.div
            className={`canto-banner canto-${tone}`}
            initial={{ opacity: 0, y: 18, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 14, scale: 0.98 }}
            transition={{ duration: 0.26, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="canto-banner-main">{text}</div>
            <div className="canto-banner-meta">
              {actor ? `${actor} canto` : "Canto en mesa"}
              {waitingResponse && responder ? ` - Responde ${responder}` : ""}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
