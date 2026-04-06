"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowLeft, Lock, Star } from "lucide-react";
import { AuthBackgroundCanvas } from "@/features/auth/components/AuthBackgroundCanvas";

type MissionStatus = "completed" | "in_progress" | "locked";

type Mission = {
  id: string;
  title: string;
  status: MissionStatus;
};

type World = {
  id: string;
  name: string;
  description: string;
  progress: number;
  mapX: number;
  mapY: number;
  planetImage: string;
  missions: Mission[];
};

type RocketTrip = {
  id: number;
  toIndex: number;
  fromX: number;
  fromY: number;
  controlX: number;
  controlY: number;
  toX: number;
  toY: number;
};

const WORLDS: World[] = [
  {
    id: "math",
    name: "Matematica",
    description: "Numeros, logica y problemas.",
    progress: 62,
    mapX: 12,
    mapY: 24,
    planetImage: "/mercurio.png",
    missions: [
      { id: "m-1", title: "Mision 1 - Sumas y restas", status: "completed" },
      { id: "m-2", title: "Mision 2 - Multiplicacion", status: "completed" },
      { id: "m-3", title: "Mision 3 - Division", status: "in_progress" },
      { id: "m-4", title: "Mision 4 - Problemas mixtos", status: "locked" },
    ],
  },
  {
    id: "language",
    name: "Lengua",
    description: "Lectura, escritura y comprension.",
    progress: 44,
    mapX: 34,
    mapY: 44,
    planetImage: "/marte.png",
    missions: [
      { id: "l-1", title: "Mision 1 - Lectura activa", status: "completed" },
      { id: "l-2", title: "Mision 2 - Vocabulario", status: "in_progress" },
      { id: "l-3", title: "Mision 3 - Produccion escrita", status: "locked" },
    ],
  },
  {
    id: "science",
    name: "Ciencias",
    description: "Observacion y experimentos.",
    progress: 73,
    mapX: 56,
    mapY: 21,
    planetImage: "/tierra.png",
    missions: [
      { id: "c-1", title: "Mision 1 - Materia y energia", status: "completed" },
      { id: "c-2", title: "Mision 2 - Estados del agua", status: "completed" },
      { id: "c-3", title: "Mision 3 - Ciclos naturales", status: "in_progress" },
      { id: "c-4", title: "Mision 4 - Laboratorio final", status: "locked" },
    ],
  },
  {
    id: "history",
    name: "Historia",
    description: "Linea del tiempo y contexto.",
    progress: 28,
    mapX: 78,
    mapY: 42,
    planetImage: "/saturno.png",
    missions: [
      { id: "h-1", title: "Mision 1 - Primeros periodos", status: "completed" },
      { id: "h-2", title: "Mision 2 - Cambios y causas", status: "in_progress" },
      { id: "h-3", title: "Mision 3 - Sintesis final", status: "locked" },
    ],
  },
  {
    id: "art",
    name: "Arte",
    description: "Composicion, color y expresion.",
    progress: 84,
    mapX: 63,
    mapY: 72,
    planetImage: "/neptuno.png",
    missions: [
      { id: "a-1", title: "Mision 1 - Paleta base", status: "completed" },
      { id: "a-2", title: "Mision 2 - Formas y equilibrio", status: "completed" },
      { id: "a-3", title: "Mision 3 - Proyecto final", status: "in_progress" },
      { id: "a-4", title: "Mision 4 - Curaduria", status: "locked" },
    ],
  },
  {
    id: "tech",
    name: "Tecnologia",
    description: "Secuencias logicas y sistemas.",
    progress: 56,
    mapX: 26,
    mapY: 74,
    planetImage: "/urano.png",
    missions: [
      { id: "t-1", title: "Mision 1 - Patrones", status: "completed" },
      { id: "t-2", title: "Mision 2 - Secuencias", status: "completed" },
      { id: "t-3", title: "Mision 3 - Mini algoritmo", status: "in_progress" },
      { id: "t-4", title: "Mision 4 - Proyecto integrador", status: "locked" },
    ],
  },
];

const shellVariants = {
  initial: { opacity: 0, scale: 0.985, y: 10 },
  animate: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.32 } },
  exit: { opacity: 0, scale: 0.99, y: -8, transition: { duration: 0.22 } },
};

const listVariants = {
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: { delayChildren: 0.06, staggerChildren: 0.08 },
  },
};

const itemVariants = {
  initial: { opacity: 0, y: 14, scale: 0.98 },
  animate: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.3 } },
};

function routePath(from: World, to: World, index: number) {
  const { controlX, controlY } = routeControlPoint(from, to, index);
  return `M ${from.mapX} ${from.mapY} Q ${controlX} ${controlY} ${to.mapX} ${to.mapY}`;
}

function routeControlPoint(from: World, to: World, index: number) {
  const controlX = (from.mapX + to.mapX) / 2 + (index % 2 === 0 ? 5 : -5);
  const controlY = (from.mapY + to.mapY) / 2 + (index % 2 === 0 ? -7 : 7);
  return { controlX, controlY };
}

function worldProgressFromMissions(missions: Mission[]) {
  const completed = missions.filter((mission) => mission.status === "completed").length;
  return Math.round((completed / missions.length) * 100);
}

function worldIsCompleted(world: World) {
  return world.missions.every((mission) => mission.status === "completed");
}

function progressOrbit(progress: number) {
  const angle = progress * 3.6;
  return {
    background: `conic-gradient(rgba(255,255,255,0.95) ${angle}deg, rgba(255,255,255,0.24) ${angle}deg 360deg)`,
  };
}

function PlanetVisual({
  world,
  diameter,
  withProgress = true,
  atmosphericGlow = true,
}: {
  world: World;
  diameter: number;
  withProgress?: boolean;
  atmosphericGlow?: boolean;
}) {
  const padding = Math.max(3, Math.round(diameter * 0.06));
  const imageScale = withProgress ? 1.95 : 1.55;

  return (
    <div className="relative" style={{ width: `${diameter}px`, height: `${diameter}px` }}>
      {atmosphericGlow ? (
        <span className="absolute inset-[-14%] rounded-full bg-white/10 blur-xl" />
      ) : null}

      <div
        className="relative h-full w-full rounded-full shadow-[0_14px_30px_rgba(7,10,28,0.62)]"
        style={withProgress ? progressOrbit(world.progress) : undefined}
      >
        <div
          className="relative flex items-center justify-center rounded-full border border-white/40"
          style={{
            margin: withProgress ? `${padding}px` : "0px",
            width: withProgress ? `calc(100% - ${padding * 2}px)` : "100%",
            height: withProgress ? `calc(100% - ${padding * 2}px)` : "100%",
          }}
        >
          <Image
            src={world.planetImage}
            alt={world.name}
            fill
            sizes={`${diameter}px`}
            className="h-full w-full object-contain select-none pointer-events-none mix-blend-lighten"
            style={{ transform: `scale(${imageScale})` }}
            draggable={false}
          />
        </div>
      </div>
    </div>
  );
}

function MissionStatusIcon({ status }: { status: MissionStatus }) {
  if (status === "completed") {
    return (
      <span className="inline-flex h-6 w-6 items-center justify-center rounded-full border border-amber-300 bg-amber-50 text-amber-500">
        <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
      </span>
    );
  }

  if (status === "locked") {
    return (
      <span className="inline-flex h-6 w-6 items-center justify-center rounded-full border border-slate-200 bg-slate-100 text-slate-400">
        <Lock className="h-3.5 w-3.5" />
      </span>
    );
  }

  return <span className="inline-flex h-3 w-3 rounded-full bg-sky-400 shadow-[0_0_0_4px_rgba(56,189,248,0.25)]" />;
}

function MapRocketSprite() {
  return (
    <span className="relative block">
      <span className="block text-[30px] leading-none filter drop-shadow-[0_0_10px_#fcd34d] drop-shadow-[0_0_20px_#fb923c]">
        🚀
      </span>
      <span className="pointer-events-none absolute left-1/2 top-[78%] -translate-x-1/2 text-[14px] opacity-80 filter drop-shadow-[0_0_8px_#fb923c]">
        🔥
      </span>
    </span>
  );
}

function PlanetNode({
  world,
  index,
  isCompleted,
  onSelect,
}: {
  world: World;
  index: number;
  isCompleted: boolean;
  onSelect: (id: string) => void;
}) {
  return (
    <motion.button
      type="button"
      onClick={() => onSelect(world.id)}
      variants={itemVariants}
      animate={{ y: [0, -5, 0] }}
      transition={{ duration: 6 + index * 0.5, repeat: Infinity, ease: "easeInOut" }}
      style={{ left: `${world.mapX}%`, top: `${world.mapY}%` }}
      className="group absolute -translate-x-1/2 -translate-y-1/2 text-center"
    >
      <div className="relative">
        {isCompleted ? (
          <motion.span
            className="pointer-events-none absolute inset-[-18px] rounded-full bg-amber-300/30 blur-2xl"
            animate={{ opacity: [0.35, 0.75, 0.35], scale: [1, 1.08, 1] }}
            transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
          />
        ) : null}
        <PlanetVisual world={world} diameter={168} withProgress={false} />
        <span
          className={`pointer-events-none absolute inset-[-10px] rounded-full border transition group-hover:scale-110 ${
            isCompleted ? "border-amber-300/60 shadow-[0_0_20px_rgba(252,211,77,0.55)]" : "border-white/20"
          }`}
        />
      </div>

      <div className="mt-3 rounded-xl border border-white/15 bg-slate-900/45 px-3 py-2 backdrop-blur-sm">
        <p className="text-sm font-semibold text-white">{world.name}</p>
        <p className="text-[11px] text-slate-200/80">{world.missions.length} misiones · {world.progress}%</p>
      </div>
    </motion.button>
  );
}

function WorldPlanetBadge({ world }: { world: World }) {
  return <PlanetVisual world={world} diameter={84} atmosphericGlow={false} />;
}

export default function StudentWorldsMapView() {
  const [worlds, setWorlds] = useState<World[]>(WORLDS);
  const [selectedWorldId, setSelectedWorldId] = useState<string | null>(null);
  const [rocketTrip, setRocketTrip] = useState<RocketTrip | null>(null);
  const [rocketWorldIndex, setRocketWorldIndex] = useState(() => {
    const firstIncomplete = WORLDS.findIndex((world) => !worldIsCompleted(world));
    return firstIncomplete === -1 ? WORLDS.length - 1 : firstIncomplete;
  });

  const selectedWorld = useMemo(
    () => worlds.find((world) => world.id === selectedWorldId) ?? null,
    [selectedWorldId, worlds]
  );

  const completeMission = (worldId: string, missionId: string) => {
    let nextTrip: RocketTrip | null = null;
    let nextRocketIndex: number | null = null;

    setWorlds((previousWorlds) => {
      const worldIndex = previousWorlds.findIndex((world) => world.id === worldId);
      if (worldIndex === -1) return previousWorlds;

      const currentWorld = previousWorlds[worldIndex];
      const missionIndex = currentWorld.missions.findIndex((mission) => mission.id === missionId);
      if (missionIndex === -1) return previousWorlds;

      const selectedMission = currentWorld.missions[missionIndex];
      if (selectedMission.status !== "in_progress") return previousWorlds;

      const updatedMissions = currentWorld.missions.map((mission, index) =>
        index === missionIndex ? { ...mission, status: "completed" as MissionStatus } : mission
      );

      if (!updatedMissions.some((mission) => mission.status === "in_progress")) {
        const nextLockedIndex = updatedMissions.findIndex((mission) => mission.status === "locked");
        if (nextLockedIndex !== -1) {
          updatedMissions[nextLockedIndex] = { ...updatedMissions[nextLockedIndex], status: "in_progress" };
        }
      }

      const wasCompleted = worldIsCompleted(currentWorld);
      const nowCompleted = updatedMissions.every((mission) => mission.status === "completed");

      const nextWorlds = [...previousWorlds];
      nextWorlds[worldIndex] = {
        ...currentWorld,
        missions: updatedMissions,
        progress: worldProgressFromMissions(updatedMissions),
      };

      if (!wasCompleted && nowCompleted) {
        const targetIndex = Math.min(worldIndex + 1, nextWorlds.length - 1);
        nextRocketIndex = targetIndex;

        if (targetIndex !== worldIndex) {
          const from = nextWorlds[worldIndex];
          const to = nextWorlds[targetIndex];
          const { controlX, controlY } = routeControlPoint(from, to, worldIndex);

          nextTrip = {
            id: Date.now(),
            toIndex: targetIndex,
            fromX: from.mapX,
            fromY: from.mapY,
            controlX,
            controlY,
            toX: to.mapX,
            toY: to.mapY,
          };
        }
      }

      return nextWorlds;
    });

    if (nextTrip) {
      setRocketTrip(nextTrip);
      return;
    }

    if (nextRocketIndex !== null) {
      setRocketWorldIndex(nextRocketIndex);
    }
  };

  return (
    <section className="relative min-h-[calc(100vh-3rem)] overflow-hidden rounded-[28px] border border-white/15 bg-[#090f2a] p-6 md:p-10">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <AuthBackgroundCanvas />
        <motion.div
          className="absolute -left-28 top-0 h-[26rem] w-[26rem] rounded-full bg-cyan-400/22 blur-3xl"
          animate={{ y: [0, 24, 0], scale: [1, 1.08, 1] }}
          transition={{ duration: 9, repeat: Infinity }}
        />
        <motion.div
          className="absolute -right-24 bottom-0 h-[28rem] w-[28rem] rounded-full bg-violet-500/20 blur-3xl"
          animate={{ y: [0, -30, 0], scale: [1, 1.1, 1] }}
          transition={{ duration: 11, repeat: Infinity }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/10 via-slate-950/30 to-slate-950/55" />
      </div>

      <div className="relative z-10">
        <AnimatePresence mode="wait">
          {!selectedWorld ? (
            <motion.div
              key="world-map"
              variants={shellVariants}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              <header className="mb-8">
                <h1 className="text-3xl font-semibold tracking-tight text-white md:text-4xl">
                  Mapa de mundos
                </h1>
                <p className="mt-2 text-sm text-slate-200/90">
                  Cada materia es un planeta. Elegi uno para entrar a sus misiones.
                </p>
              </header>

              <motion.div
                className="relative hidden h-[640px] overflow-hidden rounded-[30px] border border-white/15 bg-white/[0.03] backdrop-blur-[2px] md:block"
                variants={listVariants}
                initial="initial"
                animate="animate"
              >
                <svg
                  className="absolute inset-0 h-full w-full"
                  viewBox="0 0 100 100"
                  preserveAspectRatio="none"
                  aria-hidden
                >
                  {worlds.slice(0, -1).map((world, index) => {
                    const next = worlds[index + 1];
                    return (
                      <path
                        key={`${world.id}-${next.id}`}
                        d={routePath(world, next, index)}
                        fill="none"
                        stroke="rgba(226,232,240,0.55)"
                        strokeWidth="0.35"
                        strokeDasharray="1.2 1.2"
                      />
                    );
                  })}
                </svg>

                {worlds.map((world, index) => (
                  <PlanetNode
                    key={world.id}
                    world={world}
                    index={index}
                    isCompleted={worldIsCompleted(world)}
                    onSelect={setSelectedWorldId}
                  />
                ))}

                {rocketTrip ? (
                  <motion.div
                    key={rocketTrip.id}
                    className="pointer-events-none absolute -translate-x-1/2 -translate-y-1/2"
                    initial={{ left: `${rocketTrip.fromX}%`, top: `${rocketTrip.fromY}%`, rotate: -20 }}
                    animate={{
                      left: [`${rocketTrip.fromX}%`, `${rocketTrip.controlX}%`, `${rocketTrip.toX}%`],
                      top: [`${rocketTrip.fromY}%`, `${rocketTrip.controlY}%`, `${rocketTrip.toY}%`],
                      rotate: [-20, 8, 20],
                    }}
                    transition={{ duration: 1.6, ease: "easeInOut" }}
                    onAnimationComplete={() => {
                      setRocketWorldIndex(rocketTrip.toIndex);
                      setRocketTrip(null);
                    }}
                  >
                    <MapRocketSprite />
                  </motion.div>
                ) : (
                  <motion.div
                    className="pointer-events-none absolute -translate-x-1/2 -translate-y-1/2"
                    style={{
                      left: `${worlds[Math.max(0, Math.min(rocketWorldIndex, worlds.length - 1))].mapX}%`,
                      top: `${worlds[Math.max(0, Math.min(rocketWorldIndex, worlds.length - 1))].mapY}%`,
                    }}
                    animate={{ y: [0, -4, 0], rotate: [-8, 8, -8] }}
                    transition={{ duration: 2.1, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <MapRocketSprite />
                  </motion.div>
                )}
              </motion.div>

              <motion.div
                className="grid grid-cols-2 gap-3 md:hidden"
                variants={listVariants}
                initial="initial"
                animate="animate"
              >
                {worlds.map((world) => (
                  <motion.button
                    key={world.id}
                    type="button"
                    onClick={() => setSelectedWorldId(world.id)}
                    variants={itemVariants}
                    className="rounded-2xl border border-white/15 bg-slate-900/50 p-4 text-left backdrop-blur-sm"
                  >
                    <div className="mb-3">
                      <PlanetVisual
                        world={world}
                        diameter={52}
                        withProgress={false}
                        atmosphericGlow={false}
                      />
                    </div>
                    <p className="text-sm font-semibold text-white">{world.name}</p>
                    <p className="mt-0.5 text-xs text-slate-200/80">{world.missions.length} misiones</p>
                  </motion.button>
                ))}
              </motion.div>
            </motion.div>
          ) : (
            <motion.div
              key={selectedWorld.id}
              variants={shellVariants}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              <button
                type="button"
                onClick={() => setSelectedWorldId(null)}
                className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-slate-900/55 px-4 py-2 text-sm text-slate-100 transition hover:bg-slate-900/75"
              >
                <ArrowLeft className="h-4 w-4" />
                Volver al mapa
              </button>

              <header className="rounded-2xl border border-white/20 bg-slate-900/55 p-6 backdrop-blur-sm">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <h2 className="text-2xl font-semibold tracking-tight text-white">
                      Mundo {selectedWorld.name}
                    </h2>
                    <p className="mt-2 text-sm text-slate-200/90">{selectedWorld.description}</p>
                  </div>
                  <WorldPlanetBadge world={selectedWorld} />
                </div>
                <div className="mt-4">
                  <div className="mb-1 flex items-center justify-between text-xs text-slate-300">
                    <span>Progreso del mundo</span>
                    <span className="font-medium text-white">{selectedWorld.progress}%</span>
                  </div>
                  <div className="h-2 rounded-full bg-white/15">
                    <div className="h-2 rounded-full bg-white/90" style={{ width: `${selectedWorld.progress}%` }} />
                  </div>
                </div>
              </header>

              <motion.div
                className="relative mt-8 pl-8"
                variants={listVariants}
                initial="initial"
                animate="animate"
              >
                <div className="absolute bottom-2 left-3 top-2 w-px bg-white/25" />

                <div className="space-y-4">
                  {selectedWorld.missions.map((mission, index) => {
                    const isCompleted = mission.status === "completed";
                    const isInProgress = mission.status === "in_progress";
                    const isLocked = mission.status === "locked";

                    return (
                      <motion.article
                        key={mission.id}
                        variants={itemVariants}
                        className={`relative rounded-2xl border p-4 shadow-[0_8px_18px_rgba(7,10,28,0.45)] ${
                          isCompleted ? "border-amber-200/70 bg-amber-50/95" : ""
                        } ${
                          isInProgress
                            ? "border-sky-200/80 bg-sky-50/95 shadow-[0_10px_22px_rgba(56,189,248,0.24)]"
                            : ""
                        } ${isLocked ? "border-white/20 bg-white/80 opacity-55" : ""} ${
                          !isCompleted && !isInProgress && !isLocked ? "border-white/20 bg-white/90" : ""
                        }`}
                      >
                        <div className="absolute -left-[31px] top-5 z-10 flex h-6 w-6 items-center justify-center rounded-full bg-slate-900/70">
                          <MissionStatusIcon status={mission.status} />
                        </div>

                        <div className="flex items-center justify-between gap-3">
                          <div>
                            <p className="text-xs uppercase tracking-[0.12em] text-slate-500">
                              Mision {index + 1}
                            </p>
                            <h3 className="mt-1 text-base font-medium text-slate-900">{mission.title}</h3>
                          </div>
                          <div className="flex items-center gap-2">
                            {mission.status === "in_progress" ? (
                              <button
                                type="button"
                                onClick={() => completeMission(selectedWorld.id, mission.id)}
                                className="rounded-full border border-emerald-300 bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700 transition hover:bg-emerald-200"
                              >
                                Completar
                              </button>
                            ) : null}
                            <span className="rounded-full border border-slate-200 px-3 py-1 text-xs text-slate-600">
                              {mission.status === "completed" ? "Completada" : ""}
                              {mission.status === "in_progress" ? "En progreso" : ""}
                              {mission.status === "locked" ? "Bloqueada" : ""}
                            </span>
                          </div>
                        </div>
                      </motion.article>
                    );
                  })}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}

