"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { Eye, EyeOff, Lock, Mail, User } from "lucide-react";
import type { AuthFormData, AuthMode } from "@/features/auth/types/auth-view.types";
import { useAuthStore } from "@/store/auth/auth.store";
import {
  getGoogleAuthUrl,
  loginWithEmailPassword,
  registerParent,
  registerTeacher,
} from "@/services/auth/auth.service";

type AuthFormCardProps = {
  defaultMode?: AuthMode;
};

type RegisterRole = "parent" | "teacher";

const getNameParts = (name: string) => {
  const normalized = name.trim().replace(/\s+/g, " ");
  const parts = normalized.split(" ");

  if (parts.length <= 1) {
    return { firstName: parts[0] || "Docente", lastName: "Novi" };
  }

  return {
    firstName: parts.slice(0, -1).join(" "),
    lastName: parts.slice(-1).join(" "),
  };
};

const getRedirectByRole = (role?: string) => {
  if (role === "teacher") return "/dashboard/teacher";
  if (role === "parent") return "/dashboard/parent";
  if (role === "student") return "/dashboard/student";
  return "/";
};

export function AuthFormCard({ defaultMode = "login" }: AuthFormCardProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const setSession = useAuthStore((state) => state.setSession);
  const registerRole: RegisterRole = searchParams.get("role") === "teacher" ? "teacher" : "parent";

  const [mode, setMode] = useState<AuthMode>(defaultMode);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const [formData, setFormData] = useState<AuthFormData>({
    name: "",
    childName: "",
    schoolName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const isRegister = mode === "register";
  const canSubmitRegister = registerRole !== "parent" || acceptTerms;

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);
    setIsSubmitting(true);

    try {
      if (isRegister) {
        if (registerRole === "parent" && !acceptTerms) {
          throw new Error("Confirmá que sos padre, madre o tutor legal.");
        }

        if (formData.password !== formData.confirmPassword) {
          throw new Error("Las contraseñas no coinciden.");
        }

        const { firstName, lastName } = getNameParts(formData.name);

        if (registerRole === "teacher") {
          await registerTeacher({
            first_name: firstName,
            last_name: lastName,
            email: formData.email.trim().toLowerCase(),
            password: formData.password,
            country: "Argentina",
            recaptcha_token: "dev",
          });
        } else {
          await registerParent({
            first_name: firstName,
            last_name: lastName,
            email: formData.email.trim().toLowerCase(),
            password: formData.password,
            student_email: formData.childName.trim().toLowerCase(),
            recaptcha_token: "dev",
          });
        }

        setSuccessMessage(
          registerRole === "teacher"
            ? "Cuenta docente creada. Revisá tu email para verificarla y luego iniciá sesión."
            : "Cuenta familiar creada. Revisá tu email para verificarla y luego iniciá sesión."
        );

        setMode("login");
        setFormData((current) => ({
          ...current,
          childName: "",
          schoolName: "",
          password: "",
          confirmPassword: "",
        }));
      } else {
        const session = await loginWithEmailPassword({
          email: formData.email.trim().toLowerCase(),
          password: formData.password,
        });

        setSession({
          accessToken: session.accessToken,
          refreshToken: session.refreshToken,
        });

        if (!rememberMe) {
          // Comportamiento actual: se guarda en localStorage siempre por tokenStorage.
          // TODO: agregar strategy de sessionStorage si se requiere "no recordar".
        }

        router.push(getRedirectByRole(session.role));
        router.refresh();
      }
    } catch (error) {
      if (error instanceof Error && error.message) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage("No se pudo completar la operación. Inténtalo de nuevo.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleAuth = () => {
    window.location.href = getGoogleAuthUrl();
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.8 }}
      className="w-full lg:max-w-[460px] xl:max-w-[480px] lg:ml-auto"
    >
      <div
        id="auth-form-card"
        className="relative overflow-hidden bg-white rounded-[28px] shadow-xl shadow-black/25 p-6 sm:p-7 lg:p-7 xl:p-8 border border-white/70"
      >
        <div className="lg:hidden mb-6 text-center">
          <div className="inline-flex items-center mb-3">
            <img
              src="/NOVI.png"
              alt="NOVI"
              className="h-12 sm:h-14 w-auto object-contain drop-shadow-[0_8px_20px_rgba(0,0,0,0.24)]"
            />
          </div>
          <p className="text-sm text-slate-500">Tu plataforma de aprendizaje</p>
        </div>

        <div className="flex gap-2 mb-6 bg-slate-100 p-1 rounded-xl">
          <button
            onClick={() => setMode("login")}
            className={`flex-1 py-2.5 px-4 rounded-lg font-bold text-sm transition-all ${
              mode === "login"
                ? "bg-white text-blue-600 shadow-md"
                : "text-slate-500 hover:text-slate-700"
            }`}
            type="button"
          >
            Iniciar sesión
          </button>
          <button
            onClick={() => setMode("register")}
            className={`flex-1 py-2.5 px-4 rounded-lg font-bold text-sm transition-all ${
              mode === "register"
                ? "bg-white text-blue-600 shadow-md"
                : "text-slate-500 hover:text-slate-700"
            }`}
            type="button"
          >
            Crear cuenta
          </button>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={mode}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            <form onSubmit={handleSubmit} className="space-y-4">
              <input type="hidden" name="role" id="role-input" value={registerRole} readOnly />

              {errorMessage ? (
                <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {errorMessage}
                </div>
              ) : null}

              {successMessage ? (
                <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                  {successMessage}
                </div>
              ) : null}

              {isRegister ? (
                <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
                  <p className="text-sm font-semibold text-slate-800">
                    {registerRole === "teacher" ? "Cuenta docente" : "Cuenta familiar"}
                  </p>
                  <p className="text-xs text-slate-600 mt-1">
                    {registerRole === "teacher"
                      ? "Completá los datos para crear tu cuenta docente."
                      : "Completá los datos del adulto responsable para crear la cuenta."}
                  </p>
                </div>
              ) : null}

              {isRegister ? (
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Nombre completo
                  </label>
                  <div className="relative">
                    <User
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                      size={18}
                    />
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(event) =>
                        setFormData({ ...formData, name: event.target.value })
                      }
                      className="w-full pl-10 pr-4 py-3.5 border-2 border-slate-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all text-slate-800 font-medium"
                      placeholder="Ej: María González"
                      required
                    />
                  </div>
                </div>
              ) : null}

              {isRegister && registerRole === "parent" ? (
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Email del niño/a
                  </label>
                  <div className="relative">
                    <User
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                      size={18}
                    />
                    <input
                      type="email"
                      value={formData.childName}
                      onChange={(event) =>
                        setFormData({ ...formData, childName: event.target.value })
                      }
                      className="w-full pl-10 pr-4 py-3.5 border-2 border-slate-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all text-slate-800 font-medium"
                      placeholder="alumno@email.com"
                      required
                    />
                  </div>
                </div>
              ) : null}

              {isRegister && registerRole === "teacher" ? (
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Nombre de la escuela
                  </label>
                  <div className="relative">
                    <User
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                      size={18}
                    />
                    <input
                      type="text"
                      value={formData.schoolName}
                      onChange={(event) =>
                        setFormData({ ...formData, schoolName: event.target.value })
                      }
                      className="w-full pl-10 pr-4 py-3.5 border-2 border-slate-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all text-slate-800 font-medium"
                      placeholder="Ej: Escuela Primaria N° 12"
                      required
                    />
                  </div>
                </div>
              ) : null}

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Correo electrónico
                </label>
                <div className="relative">
                  <Mail
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                    size={18}
                  />
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(event) =>
                      setFormData({ ...formData, email: event.target.value })
                    }
                    className="w-full pl-10 pr-4 py-3.5 border-2 border-slate-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all text-slate-800 font-medium"
                    placeholder="tu@email.com"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Contraseña
                </label>
                <div className="relative">
                  <Lock
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                    size={18}
                  />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={(event) =>
                      setFormData({ ...formData, password: event.target.value })
                    }
                    className="w-full pl-10 pr-10 py-3.5 border-2 border-slate-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all text-slate-800 font-medium"
                    placeholder="â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((previous) => !previous)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {isRegister ? (
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Confirmar contraseña
                  </label>
                  <div className="relative">
                    <Lock
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                      size={18}
                    />
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      value={formData.confirmPassword}
                      onChange={(event) =>
                        setFormData({
                          ...formData,
                          confirmPassword: event.target.value,
                        })
                      }
                      className="w-full pl-10 pr-10 py-3.5 border-2 border-slate-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all text-slate-800 font-medium"
                      placeholder="â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢"
                      required
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword((previous) => !previous)
                      }
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(event) => setRememberMe(event.target.checked)}
                      className="w-5 h-5 rounded border-2 border-slate-300 text-blue-600 focus:ring-2 focus:ring-blue-100 cursor-pointer"
                    />
                    <span className="text-sm text-slate-600 group-hover:text-slate-800 font-medium">
                      Recordarme
                    </span>
                  </label>
                  <a
                    href="#"
                    className="text-sm font-semibold text-blue-600 hover:text-blue-700"
                  >
                    ¿Olvidaste tu contraseña?
                  </a>
                </div>
              )}

              {isRegister && registerRole === "parent" ? (
                <label className="flex items-start gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={acceptTerms}
                    onChange={(event) => setAcceptTerms(event.target.checked)}
                    className="w-5 h-5 mt-0.5 rounded border-2 border-slate-300 text-blue-600 focus:ring-2 focus:ring-blue-100 cursor-pointer"
                  />
                  <span className="text-sm text-slate-600 group-hover:text-slate-800 font-medium">
                    Confirmo que soy padre, madre o tutor legal
                  </span>
                </label>
              ) : null}

              <motion.button
                type="submit"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                disabled={isSubmitting || (isRegister && !canSubmitRegister)}
                className="w-full py-3.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-xl shadow-lg shadow-blue-300/40 hover:shadow-xl hover:shadow-blue-400/50 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isSubmitting
                  ? "Procesando..."
                  : isRegister
                    ? "Crear mi cuenta"
                    : "Iniciar sesión"}
              </motion.button>

              <div className="relative my-5">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-200" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white text-slate-500 font-medium">
                    o continuar con
                  </span>
                </div>
              </div>

              <motion.button
                type="button"
                onClick={handleGoogleAuth}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-3.5 border-2 border-slate-200 rounded-xl font-semibold text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-all flex items-center justify-center gap-3"
              >
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path
                    d="M19.6 10.227c0-.709-.064-1.39-.182-2.045H10v3.868h5.382a4.6 4.6 0 01-1.996 3.018v2.51h3.232c1.891-1.742 2.982-4.305 2.982-7.35z"
                    fill="#4285F4"
                  />
                  <path
                    d="M10 20c2.7 0 4.964-.895 6.618-2.423l-3.232-2.509c-.895.6-2.04.955-3.386.955-2.605 0-4.81-1.76-5.595-4.123H1.064v2.59A9.996 9.996 0 0010 20z"
                    fill="#34A853"
                  />
                  <path
                    d="M4.405 11.9c-.2-.6-.314-1.24-.314-1.9 0-.66.114-1.3.314-1.9V5.51H1.064A9.996 9.996 0 000 10c0 1.614.386 3.14 1.064 4.49l3.34-2.59z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M10 3.977c1.468 0 2.786.505 3.823 1.496l2.868-2.868C14.959.99 12.695 0 10 0 6.09 0 2.71 2.24 1.064 5.51l3.34 2.59C5.19 5.736 7.395 3.977 10 3.977z"
                    fill="#EA4335"
                  />
                </svg>
                Google
              </motion.button>

              <p className="text-center text-sm text-slate-600 mt-4">
                {isRegister ? "¿Ya tenés cuenta? " : "¿No tenés una cuenta? "}
                <button
                  type="button"
                  onClick={() =>
                    setMode((currentMode) =>
                      currentMode === "login" ? "register" : "login"
                    )
                  }
                  className="font-bold text-blue-600 hover:text-blue-700"
                >
                  {isRegister ? "Iniciá sesión" : "Registrate aquí"}
                </button>
              </p>
            </form>
          </motion.div>
        </AnimatePresence>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.1 }}
        className="mt-4 text-center"
      >
        <p className="text-xs text-slate-300 italic">
          &quot;El aprendizaje es un tesoro que seguirá a su dueño en todas partes&quot;
        </p>
      </motion.div>
    </motion.div>
  );
}

