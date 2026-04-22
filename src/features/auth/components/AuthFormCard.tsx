"use client";

import axios from "axios";
import { useState } from "react";
import type { FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { Check, Eye, EyeOff, Lock, Mail, User, X } from "lucide-react";
import type { AuthFormData, AuthMode } from "@/features/auth/types/auth-view.types";
import { useAuthStore } from "@/store/auth/auth.store";
import {
  forgotPassword,
  getGoogleAuthUrl,
  loginWithEmailPassword,
  registerParent,
  registerStudent,
  registerTeacher,
} from "@/services/auth/auth.service";
import { extractApiErrorMessage } from "@/lib/axios/extract-api-error-message";

type AuthFormCardProps = {
  defaultMode?: AuthMode;
};

type RegisterRole = "parent" | "teacher" | "student";

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
  const requestedRole = searchParams.get("role");
  const registerRole: RegisterRole =
    requestedRole === "teacher"
      ? "teacher"
      : requestedRole === "student"
        ? "student"
        : "parent";

  const [mode, setMode] = useState<AuthMode>(defaultMode);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isForgotPasswordOpen, setIsForgotPasswordOpen] = useState(false);
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState("");
  const [forgotPasswordError, setForgotPasswordError] = useState<string | null>(null);
  const [forgotPasswordSuccess, setForgotPasswordSuccess] = useState<string | null>(null);
  const [isSubmittingForgotPassword, setIsSubmittingForgotPassword] = useState(false);

  const [formData, setFormData] = useState<AuthFormData>({
    name: "",
    schoolName: "",
    studentAlias: "",
    inviteCode: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const isRegister = mode === "register";
  const canSubmitRegister = registerRole !== "parent" || acceptTerms;

  const updateRole = (role: RegisterRole) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("role", role);
    params.set("mode", "register");
    router.replace(`/register?${params.toString()}`);
  };

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

        if (registerRole === "teacher") {
          const { firstName, lastName } = getNameParts(formData.name);
          await registerTeacher({
            first_name: formData.first_name.trim(),
            last_name: formData.last_name.trim(),
            email: formData.email.trim().toLowerCase(),
            password: formData.password,
            country: "Argentina",
            recaptcha_token: "dev",
          });
        } else if (registerRole === "parent") {
          const { firstName, lastName } = getNameParts(formData.name);
          await registerParent({
            first_name: formData.first_name.trim(),
            last_name: formData.last_name.trim(),
            email: formData.email.trim().toLowerCase(),
            password: formData.password,
            recaptcha_token: "dev",
          });
        } else {
          const inviteCode = formData.inviteCode.trim().toUpperCase();
          await registerStudent({
            alias: formData.studentAlias.trim(),
            email: formData.email.trim().toLowerCase(),
            password: formData.password,
            avatar_id: "avatar_01",
            ...(inviteCode ? { invite_code: inviteCode } : {}),
            recaptcha_token: "dev",
          });
        }

        setSuccessMessage(
          registerRole === "teacher"
            ? "Cuenta docente creada. Revisá tu email para verificarla y luego iniciá sesión."
            : registerRole === "parent"
              ? "Cuenta familiar creada. Revisá tu email para verificarla y luego iniciá sesión."
              : "Cuenta de alumno creada. Ya podés iniciar sesión."
        );

        setMode("login");
        setFormData((current) => ({
          ...current,
          schoolName: "",
          studentAlias: "",
          inviteCode: "",
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
      setErrorMessage(extractApiErrorMessage(error, "No se pudo completar la operación. Inténtalo de nuevo."));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleAuth = () => {
    window.location.href = getGoogleAuthUrl();
  };

  const handleOpenForgotPasswordModal = () => {
    setForgotPasswordEmail(formData.email.trim().toLowerCase());
    setForgotPasswordError(null);
    setForgotPasswordSuccess(null);
    setIsForgotPasswordOpen(true);
  };

  const handleCloseForgotPasswordModal = () => {
    if (isSubmittingForgotPassword) return;

    setIsForgotPasswordOpen(false);
    setForgotPasswordError(null);
    setForgotPasswordSuccess(null);
  };

  const handleForgotPasswordSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const normalizedEmail = forgotPasswordEmail.trim().toLowerCase();

    setForgotPasswordError(null);
    setForgotPasswordSuccess(null);

    if (!normalizedEmail) {
      setForgotPasswordError("Ingresá tu correo electrónico.");
      return;
    }

    setIsSubmittingForgotPassword(true);

    try {
      const response = await forgotPassword({ email: normalizedEmail });

      setForgotPasswordSuccess(
        response.message ?? "Si el email existe, te enviamos un enlace para restablecer tu contraseña."
      );
      setForgotPasswordEmail(normalizedEmail);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const rawData = error.response?.data;
        const backendMessage = typeof rawData === "object" && rawData !== null && "message" in rawData
          ? String(rawData.message)
          : null;

        setForgotPasswordError(
          backendMessage ?? "No pudimos enviar el email de recuperación. Intentá de nuevo."
        );
      } else if (error instanceof Error && error.message) {
        setForgotPasswordError(error.message);
      } else {
        setForgotPasswordError("No pudimos enviar el email de recuperación. Intentá de nuevo.");
      }
    } finally {
      setIsSubmittingForgotPassword(false);
    }
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
        className="relative overflow-hidden rounded-[28px] border border-white/70 bg-white p-6 shadow-xl shadow-black/25 sm:p-7 lg:p-7 xl:p-8"
      >
        <div className="mb-6 text-center lg:hidden">
          <div className="mb-3 inline-flex items-center">
            <img
              src="/NOVI.png"
              alt="NOVI"
              className="h-12 w-auto object-contain drop-shadow-[0_8px_20px_rgba(0,0,0,0.24)] sm:h-14"
            />
          </div>
          <p className="text-sm text-slate-500">Tu plataforma de aprendizaje</p>
        </div>

        <div className="mb-6 flex gap-2 rounded-xl bg-slate-100 p-1">
          <button
            onClick={() => setMode("login")}
            className={`flex-1 rounded-lg px-4 py-2.5 text-sm font-bold transition-all ${
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
            className={`flex-1 rounded-lg px-4 py-2.5 text-sm font-bold transition-all ${
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
                    {registerRole === "teacher"
                      ? "Cuenta docente"
                      : registerRole === "student"
                        ? "Cuenta de alumno"
                        : "Cuenta familiar"}
                  </p>
                  <p className="mt-1 text-xs text-slate-600">
                    {registerRole === "teacher"
                      ? "Completá los datos para crear tu cuenta docente."
                      : registerRole === "student"
                        ? "Completá tus datos para crear tu cuenta de alumno."
                        : "Completá los datos del adulto responsable para crear la cuenta."}
                  </p>
                  <div className="mt-3 grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => updateRole("parent")}
                      className={`rounded-lg px-3 py-2 text-xs font-bold ${
                        registerRole === "parent"
                          ? "bg-blue-600 text-white"
                          : "bg-white text-slate-700 border border-slate-200"
                      }`}
                    >
                      Familiar
                    </button>
                    <button
                      type="button"
                      onClick={() => updateRole("student")}
                      className={`rounded-lg px-3 py-2 text-xs font-bold ${
                        registerRole === "student"
                          ? "bg-blue-600 text-white"
                          : "bg-white text-slate-700 border border-slate-200"
                      }`}
                    >
                      Alumno
                    </button>
                    <button
                      type="button"
                      onClick={() => updateRole("teacher")}
                      className={`rounded-lg px-3 py-2 text-xs font-bold ${
                        registerRole === "teacher"
                          ? "bg-blue-600 text-white"
                          : "bg-white text-slate-700 border border-slate-200"
                      }`}
                    >
                      Docente
                    </button>
                  </div>
                </div>
              ) : null}

              {isRegister && registerRole !== "student" ? (
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Nombre
                  </label>
                  <div className="relative">
                    <User
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                      size={18}
                    />
                    <input
                      type="text"
                      value={formData.first_name}
                      onChange={(event) =>
                        setFormData({ ...formData, first_name: event.target.value })
                      }
                      className="w-full rounded-xl border-2 border-slate-200 py-3.5 pl-10 pr-4 font-medium text-slate-800 outline-none transition-all focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                      placeholder="Ej: María González"
                      required
                    />
                  </div>
                </div>
              ) : null}

              {isRegister ? (
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Apellido
                  </label>
                  <div className="relative">
                    <User
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                      size={18}
                    />
                    <input
                      type="text"
                      value={formData.last_name}
                      onChange={(event) =>
                        setFormData({ ...formData, last_name: event.target.value })
                      }
                      className="w-full rounded-xl border-2 border-slate-200 py-3.5 pl-10 pr-4 font-medium text-slate-800 outline-none transition-all focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                      placeholder="Ej: María González"
                      required
                    />
                  </div>
                </div>
              ) : null}

              {isRegister && registerRole === "student" ? (
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Alias del alumno
                  </label>
                  <div className="relative">
                    <User
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                      size={18}
                    />
                    <input
                      type="text"
                      value={formData.studentAlias}
                      onChange={(event) =>
                        setFormData({ ...formData, studentAlias: event.target.value })
                      }
                      className="w-full pl-10 pr-4 py-3.5 border-2 border-slate-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all text-slate-800 font-medium"
                      placeholder="Ej: Sofia123"
                      required
                    />
                  </div>
                </div>
              ) : null}

              {isRegister && registerRole === "teacher" ? (
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
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
                      className="w-full rounded-xl border-2 border-slate-200 py-3.5 pl-10 pr-4 font-medium text-slate-800 outline-none transition-all focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                      placeholder="Ej: Escuela Primaria N° 12"
                      required
                    />
                  </div>
                </div>
              ) : null}

              {isRegister && registerRole === "student" ? (
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Código de clase (opcional)
                  </label>
                  <div className="relative">
                    <User
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                      size={18}
                    />
                    <input
                      type="text"
                      value={formData.inviteCode}
                      onChange={(event) =>
                        setFormData({ ...formData, inviteCode: event.target.value.toUpperCase() })
                      }
                      className="w-full pl-10 pr-4 py-3.5 border-2 border-slate-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all text-slate-800 font-medium"
                      placeholder="ABC123"
                      maxLength={6}
                    />
                  </div>
                </div>
              ) : null}

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
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
                    className="w-full rounded-xl border-2 border-slate-200 py-3.5 pl-10 pr-4 font-medium text-slate-800 outline-none transition-all focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                    placeholder="tu@email.com"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
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
                    className="w-full rounded-xl border-2 border-slate-200 py-3.5 pl-10 pr-10 font-medium text-slate-800 outline-none transition-all focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                    placeholder="••••••••"
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
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
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
                      className="w-full rounded-xl border-2 border-slate-200 py-3.5 pl-10 pr-10 font-medium text-slate-800 outline-none transition-all focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                      placeholder="••••••••"
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
                  <label className="group flex cursor-pointer items-center gap-2">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(event) => setRememberMe(event.target.checked)}
                      className="h-5 w-5 cursor-pointer rounded border-2 border-slate-300 text-blue-600 focus:ring-2 focus:ring-blue-100"
                    />
                    <span className="text-sm font-medium text-slate-600 group-hover:text-slate-800">
                      Recordarme
                    </span>
                  </label>
                  <a
                    href="#"
                    onClick={(event) => {
                      event.preventDefault();
                      handleOpenForgotPasswordModal();
                    }}
                    className="text-sm font-semibold text-blue-600 hover:text-blue-700"
                  >
                    ¿Olvidaste tu contraseña?
                  </a>
                </div>
              )}

              {isRegister && registerRole === "parent" ? (
                <label className="group flex cursor-pointer items-start gap-3">
                  <input
                    type="checkbox"
                    checked={acceptTerms}
                    onChange={(event) => setAcceptTerms(event.target.checked)}
                    className="mt-0.5 h-5 w-5 cursor-pointer rounded border-2 border-slate-300 text-blue-600 focus:ring-2 focus:ring-blue-100"
                  />
                  <span className="text-sm font-medium text-slate-600 group-hover:text-slate-800">
                    Confirmo que soy padre, madre o tutor legal
                  </span>
                </label>
              ) : null}

              <motion.button
                type="submit"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                disabled={isSubmitting || (isRegister && !canSubmitRegister)}
                className="w-full rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 py-3.5 font-bold text-white shadow-lg shadow-blue-300/40 transition-all hover:shadow-xl hover:shadow-blue-400/50 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isSubmitting
                  ? "Procesando..."
                  : isRegister
                    ? "Crear mi cuenta"
                    : "Iniciar sesión"}
              </motion.button>

              {!isRegister || registerRole !== "student" ? (
                <>
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
                </>
              ) : null}

              <p className="mt-4 text-center text-sm text-slate-600">
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
        <p className="text-xs italic text-slate-300">
          &quot;El aprendizaje es un tesoro que seguirá a su dueño en todas partes&quot;
        </p>
      </motion.div>

      <AnimatePresence>
        {isForgotPasswordOpen ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 px-4 backdrop-blur-sm"
            onClick={handleCloseForgotPasswordModal}
          >
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 12, scale: 0.98 }}
              transition={{ duration: 0.2 }}
              className="w-full max-w-md rounded-[28px] border border-white/80 bg-white p-6 shadow-2xl shadow-slate-950/30"
              onClick={(event) => event.stopPropagation()}
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold text-slate-900">
                    Recuperar contraseña
                  </h2>
                  <p className="mt-1 text-sm text-slate-500">
                    Ingresá tu correo y te enviaremos un enlace para restablecerla.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleCloseForgotPasswordModal}
                  disabled={isSubmittingForgotPassword}
                  className="rounded-full p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600 disabled:cursor-not-allowed disabled:opacity-60"
                  aria-label="Cerrar modal"
                >
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleForgotPasswordSubmit} className="mt-6 space-y-4">
                {forgotPasswordError ? (
                  <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    {forgotPasswordError}
                  </div>
                ) : null}

                {forgotPasswordSuccess ? (
                  <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                    {forgotPasswordSuccess}
                  </div>
                ) : null}

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Correo electrónico
                  </label>
                  <div className="relative">
                    <Mail
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                      size={18}
                    />
                    <input
                      type="email"
                      value={forgotPasswordEmail}
                      onChange={(event) => setForgotPasswordEmail(event.target.value)}
                      className="w-full rounded-xl border-2 border-slate-200 py-3.5 pl-10 pr-4 font-medium text-slate-800 outline-none transition-all focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                      placeholder="tu@email.com"
                      required
                    />
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={handleCloseForgotPasswordModal}
                    disabled={isSubmittingForgotPassword}
                    className="flex-1 rounded-xl border border-slate-200 px-4 py-3 text-sm font-bold text-slate-600 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmittingForgotPassword || Boolean(forgotPasswordSuccess)}
                    className={`flex flex-1 items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-bold text-white transition-all disabled:cursor-not-allowed ${
                      forgotPasswordSuccess
                        ? "bg-emerald-500"
                        : "bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg shadow-blue-300/40 hover:shadow-xl hover:shadow-blue-400/50 disabled:opacity-70"
                    }`}
                  >
                    {forgotPasswordSuccess ? (
                      <>
                        <Check size={18} />
                        Enviado
                      </>
                    ) : isSubmittingForgotPassword ? (
                      "Enviando..."
                    ) : (
                      "Enviar"
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </motion.div>
  );
}
