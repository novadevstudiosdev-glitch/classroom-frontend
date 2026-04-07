'use client';

import { useState } from 'react';
import type { FormEvent } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { AnimatePresence, motion } from 'motion/react';
import { Eye, EyeOff, Lock, Mail, User, School } from 'lucide-react';
import type { AuthFormData, AuthMode } from '@/features/auth/types/auth-view.types';
import { useAuthStore } from '@/store/auth/auth.store';
import {
  getGoogleAuthUrl,
  loginWithEmailPassword,
  registerParent,
  registerTeacher,
} from '@/services/auth/auth.service';

type AuthFormCardProps = {
  defaultMode?: AuthMode;
};

type RegisterRole = 'parent' | 'teacher';

const getNameParts = (name: string) => {
  const normalized = name.trim().replace(/\s+/g, ' ');
  const parts = normalized.split(' ');

  if (parts.length <= 1) {
    return { firstName: parts[0] || 'Docente', lastName: 'Novi' };
  }

  return {
    firstName: parts.slice(0, -1).join(' '),
    lastName: parts.slice(-1).join(' '),
  };
};

const getRedirectByRole = (role?: string) => {
  if (role === 'teacher') return '/dashboard/teacher';
  if (role === 'parent') return '/dashboard/parent';
  if (role === 'student') return '/dashboard/student';
  return '/';
};

export function AuthFormCard({ defaultMode = 'login' }: AuthFormCardProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const setSession = useAuthStore((state) => state.setSession);
  const registerRole: RegisterRole = searchParams.get('role') === 'teacher' ? 'teacher' : 'parent';

  const [mode, setMode] = useState<AuthMode>(defaultMode);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const [formData, setFormData] = useState<AuthFormData>({
    name: '',
    childName: '',
    schoolName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const isRegister = mode === 'register';
  const canSubmitRegister = registerRole !== 'parent' || acceptTerms;

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);
    setIsSubmitting(true);

    try {
      if (isRegister) {
        if (registerRole === 'parent' && !acceptTerms) {
          throw new Error('Confirmá que sos padre, madre o tutor legal.');
        }

        if (formData.password !== formData.confirmPassword) {
          throw new Error('Las contraseñas no coinciden.');
        }

        const { firstName, lastName } = getNameParts(formData.name);

        if (registerRole === 'teacher') {
          await registerTeacher({
            first_name: firstName,
            last_name: lastName,
            email: formData.email.trim().toLowerCase(),
            password: formData.password,
            country: 'Argentina',
            recaptcha_token: 'dev',
          });
        } else {
          await registerParent({
            first_name: firstName,
            last_name: lastName,
            email: formData.email.trim().toLowerCase(),
            password: formData.password,
            student_email: formData.childName.trim().toLowerCase(),
            recaptcha_token: 'dev',
          });
        }

        setSuccessMessage(
          registerRole === 'teacher'
            ? 'Cuenta docente creada. Revisá tu email para verificarla y luego iniciá sesión.'
            : 'Cuenta familiar creada. Revisá tu email para verificarla y luego iniciá sesión.',
        );

        setMode('login');
        setFormData((current) => ({
          ...current,
          childName: '',
          schoolName: '',
          password: '',
          confirmPassword: '',
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
          // Si después querés, esto se puede migrar a sessionStorage.
        }

        router.push(getRedirectByRole(session.role));
        router.refresh();
      }
    } catch (error) {
      if (error instanceof Error && error.message) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage('No se pudo completar la operación. Inténtalo de nuevo.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleAuth = () => {
    window.location.href = getGoogleAuthUrl();
  };

  const inputBaseClass =
    'w-full rounded-2xl border border-slate-200/90 bg-slate-50/85 text-slate-900 placeholder:text-slate-400 outline-none transition-all duration-200 focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-100/80';
  const iconClass =
    'absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-blue-500';
  const passwordButtonClass =
    'absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 transition-colors hover:text-slate-600';

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.985, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.45 }}
      className="w-full max-w-[560px] mx-auto"
    >
      <div className="rounded-[32px] border border-white/60 bg-white/95 p-6 shadow-[0_20px_80px_rgba(15,23,42,0.18)] backdrop-blur-sm md:p-8 lg:p-10">
        <div className="mb-8 rounded-2xl bg-slate-100 p-1.5">
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => setMode('login')}
              type="button"
              className={`rounded-xl px-6 py-3.5 text-sm md:text-base font-semibold transition-all duration-300 ${
                mode === 'login'
                  ? 'bg-white text-blue-600 shadow-[0_6px_20px_rgba(15,23,42,0.10)]'
                  : 'bg-transparent text-slate-500 hover:text-slate-700'
              }`}
            >
              Iniciar sesión
            </button>

            <button
              onClick={() => setMode('register')}
              type="button"
              className={`rounded-xl px-6 py-3.5 text-sm md:text-base font-semibold transition-all duration-300 ${
                mode === 'register'
                  ? 'bg-white text-blue-600 shadow-[0_6px_20px_rgba(15,23,42,0.10)]'
                  : 'bg-transparent text-slate-500 hover:text-slate-700'
              }`}
            >
              Crear cuenta
            </button>
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={mode}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.22 }}
          >
            <form onSubmit={handleSubmit} className="space-y-5">
              <input type="hidden" name="role" id="role-input" value={registerRole} readOnly />

              {errorMessage ? (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm font-medium text-red-700"
                >
                  {errorMessage}
                </motion.div>
              ) : null}

              {successMessage ? (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-4 text-sm font-medium text-emerald-700"
                >
                  {successMessage}
                </motion.div>
              ) : null}

              {isRegister ? (
                <div className="rounded-2xl border border-blue-100 bg-blue-50/70 px-5 py-4">
                  <p className="text-sm font-semibold text-blue-900">
                    {registerRole === 'teacher' ? 'Cuenta docente' : 'Cuenta familiar'}
                  </p>
                  <p className="mt-1.5 text-sm leading-relaxed text-blue-700/80">
                    {registerRole === 'teacher'
                      ? 'Completá los datos para crear tu cuenta docente.'
                      : 'Completá los datos del adulto responsable.'}
                  </p>
                </div>
              ) : null}

              {isRegister ? (
                <div>
                  <label className="mb-2.5 block text-sm font-semibold text-slate-700">
                    Nombre completo
                  </label>
                  <div className="group relative">
                    <User className={iconClass} size={19} />
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(event) => setFormData({ ...formData, name: event.target.value })}
                      className={`${inputBaseClass} py-4 pl-12 pr-4 text-[15px] font-medium md:text-base`}
                      placeholder="María González"
                      required
                    />
                  </div>
                </div>
              ) : null}

              {isRegister && registerRole === 'parent' ? (
                <div>
                  <label className="mb-2.5 block text-sm font-semibold text-slate-700">
                    Email del niño/a
                  </label>
                  <div className="group relative">
                    <Mail className={iconClass} size={19} />
                    <input
                      type="email"
                      value={formData.childName}
                      onChange={(event) =>
                        setFormData({ ...formData, childName: event.target.value })
                      }
                      className={`${inputBaseClass} py-4 pl-12 pr-4 text-[15px] font-medium md:text-base`}
                      placeholder="alumno@email.com"
                      required
                    />
                  </div>
                </div>
              ) : null}

              {isRegister && registerRole === 'teacher' ? (
                <div>
                  <label className="mb-2.5 block text-sm font-semibold text-slate-700">
                    Nombre de la escuela
                  </label>
                  <div className="group relative">
                    <School className={iconClass} size={19} />
                    <input
                      type="text"
                      value={formData.schoolName}
                      onChange={(event) =>
                        setFormData({ ...formData, schoolName: event.target.value })
                      }
                      className={`${inputBaseClass} py-4 pl-12 pr-4 text-[15px] font-medium md:text-base`}
                      placeholder="Escuela Primaria N° 12"
                      required
                    />
                  </div>
                </div>
              ) : null}

              <div>
                <label className="mb-2.5 block text-sm font-semibold text-slate-700">
                  Correo electrónico
                </label>
                <div className="group relative">
                  <Mail className={iconClass} size={19} />
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(event) => setFormData({ ...formData, email: event.target.value })}
                    className={`${inputBaseClass} py-4 pl-12 pr-4 text-[15px] font-medium md:text-base`}
                    placeholder="luna@gmail.com"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="mb-2.5 block text-sm font-semibold text-slate-700">
                  Contraseña
                </label>
                <div className="group relative">
                  <Lock className={iconClass} size={19} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={(event) => setFormData({ ...formData, password: event.target.value })}
                    className={`${inputBaseClass} py-4 pl-12 pr-12 text-[15px] font-medium md:text-base`}
                    placeholder="••••••••"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((previous) => !previous)}
                    className={passwordButtonClass}
                    aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                  >
                    {showPassword ? <EyeOff size={19} /> : <Eye size={19} />}
                  </button>
                </div>
              </div>

              {isRegister ? (
                <div>
                  <label className="mb-2.5 block text-sm font-semibold text-slate-700">
                    Confirmar contraseña
                  </label>
                  <div className="group relative">
                    <Lock className={iconClass} size={19} />
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={formData.confirmPassword}
                      onChange={(event) =>
                        setFormData({
                          ...formData,
                          confirmPassword: event.target.value,
                        })
                      }
                      className={`${inputBaseClass} py-4 pl-12 pr-12 text-[15px] font-medium md:text-base`}
                      placeholder="••••••••"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword((previous) => !previous)}
                      className={passwordButtonClass}
                      aria-label={
                        showConfirmPassword
                          ? 'Ocultar confirmación de contraseña'
                          : 'Mostrar confirmación de contraseña'
                      }
                    >
                      {showConfirmPassword ? <EyeOff size={19} /> : <Eye size={19} />}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <label className="group flex cursor-pointer items-center gap-3">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(event) => setRememberMe(event.target.checked)}
                      className="h-5 w-5 cursor-pointer rounded border border-slate-300 accent-blue-600"
                    />
                    <span className="text-sm font-medium text-slate-700 group-hover:text-slate-900">
                      Recordarme
                    </span>
                  </label>

                  <a
                    href="#"
                    className="text-sm font-semibold text-blue-600 transition-colors hover:text-blue-700"
                  >
                    ¿Olvidaste tu contraseña?
                  </a>
                </div>
              )}

              {isRegister && registerRole === 'parent' ? (
                <label className="group flex cursor-pointer items-start gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4">
                  <input
                    type="checkbox"
                    checked={acceptTerms}
                    onChange={(event) => setAcceptTerms(event.target.checked)}
                    className="mt-0.5 h-5 w-5 flex-shrink-0 cursor-pointer rounded border border-slate-300 accent-blue-600"
                  />
                  <span className="text-sm font-medium leading-relaxed text-slate-700 group-hover:text-slate-900">
                    Confirmo que soy padre, madre o tutor legal
                  </span>
                </label>
              ) : null}

              <motion.button
                type="submit"
                whileHover={{ scale: 1.01, y: -1 }}
                whileTap={{ scale: 0.99 }}
                disabled={isSubmitting || (isRegister && !canSubmitRegister)}
                className="mt-2 w-full rounded-2xl bg-gradient-to-r from-blue-600 via-blue-600 to-violet-600 px-6 py-4 text-base font-bold text-white shadow-[0_12px_30px_rgba(59,130,246,0.28)] transition-all duration-300 hover:shadow-[0_16px_36px_rgba(99,102,241,0.35)] disabled:cursor-not-allowed disabled:opacity-60 md:text-lg"
              >
                {isSubmitting ? 'Procesando...' : isRegister ? 'Crear mi cuenta' : 'Iniciar sesión'}
              </motion.button>

              <div className="relative my-1 pt-1">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-200" />
                </div>
                <div className="relative flex justify-center">
                  <span className="bg-white px-4 text-sm font-medium text-slate-500">
                    o continuar con
                  </span>
                </div>
              </div>

              <motion.button
                type="button"
                onClick={handleGoogleAuth}
                whileHover={{ scale: 1.01, y: -1 }}
                whileTap={{ scale: 0.99 }}
                className="flex w-full items-center justify-center gap-3 rounded-2xl border border-slate-300 bg-white px-6 py-4 text-[15px] font-semibold text-slate-700 transition-all duration-300 hover:bg-slate-50 hover:shadow-md md:text-base"
              >
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
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

              <p className="pt-1 text-center text-sm text-slate-600">
                {isRegister ? '¿Ya tenés cuenta? ' : '¿No tenés una cuenta? '}
                <button
                  type="button"
                  onClick={() =>
                    setMode((currentMode) => (currentMode === 'login' ? 'register' : 'login'))
                  }
                  className="font-semibold text-blue-600 transition-colors hover:text-blue-700"
                >
                  {isRegister ? 'Iniciá sesión' : 'Registrate aquí'}
                </button>
              </p>
            </form>
          </motion.div>
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
