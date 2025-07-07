import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useTranslation } from 'react-i18next';
import type { User } from 'firebase/auth';

/**
 * Componente de Login.
 * Permite autenticación de usuario y muestra feedback.
 */
const Login: React.FC = () => {
  const { login, loading, user } = useAuth();
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.name === 'email') setEmail(e.target.value);
    if (e.target.name === 'password') setPassword(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      await login(email, password);
    } catch (err) {
      setError(t('Login failed'));
    }
  };

  if (user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#1C2526] text-[#FFFFFF]">
        <div className="p-8 rounded-xl bg-[#00A6A6] text-[#1C2526] font-bold text-xl">
          {t('Already logged in')}
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{
        background: 'linear-gradient(135deg, #1C2526 0%, #00A6A6 100%)',
      }}
    >
      <form
        onSubmit={handleSubmit}
        className="bg-[#1C2526] rounded-2xl shadow-2xl p-10 w-full max-w-md flex flex-col gap-8 border-4 border-[#00A6A6]"
        aria-label={t('Login Form')}
      >
        <input
          type="email"
          name="email"
          placeholder={t('Email')}
          value={email}
          onChange={handleChange}
          className="p-4 rounded-xl border-2 border-[#00A6A6] bg-[#1C2526] text-[#FFFFFF] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#00A6A6] text-lg"
          required
          aria-label={t('Email')}
        />
        <input
          type="password"
          name="password"
          placeholder={t('Password')}
          value={password}
          onChange={handleChange}
          className="p-4 rounded-xl border-2 border-[#00A6A6] bg-[#1C2526] text-[#FFFFFF] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#00A6A6] text-lg"
          required
          aria-label={t('Password')}
        />
        <button
          type="submit"
          className="bg-[#00A6A6] text-[#FFFFFF] font-bold rounded-xl p-4 shadow-lg hover:bg-[#009090] transition text-lg"
          aria-label={t('Login')}
          disabled={loading}
        >
          {loading ? t('Logging in...') : t('Login')}
        </button>
        {error && <div className="text-red-400 text-sm">{error}</div>}
      </form>
    </div>
  );
};

export default Login;

/**
 * Sugerencias de pruebas (Vitest):
 * - Renderiza formulario de login correctamente.
 * - Renderiza mensaje si ya está logueado.
 * - Accesibilidad: aria-labels presentes.
 */