import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

/**
 * Componente de login.
 * Accesible, mobile-first y alineado a SDD.
 */
const Login: React.FC = () => {
  const { t } = useTranslation();
  const { login, loading, user } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.name === 'email') {
      setEmail(e.target.value);
    } else {
      setPassword(e.target.value);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await login(email, password);
      navigate('/admin');
    } catch (error: any) {
      // Firebase Auth error codes
      if (error.code === 'auth/user-not-found') {
        toast.error('Usuario no encontrado.');
      } else if (error.code === 'auth/wrong-password') {
        toast.error('Contraseña incorrecta.');
      } else if (error.code === 'auth/too-many-requests' || error.code === 403) {
        toast.error('Acceso bloqueado temporalmente. Intenta más tarde.');
      } else if (error.code === 'auth/network-request-failed') {
        toast.error('Error de red. Verifica tu conexión.');
      } else {
        toast.error('Error al iniciar sesión. Verifica tus credenciales.');
      }
    }
  };

  if (user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <span className="text-accent text-xl">{t('Already logged in')}</span>
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
        <h1 className="text-4xl font-extrabold mb-2 text-center text-[#00A6A6] drop-shadow">SatoriPOS</h1>
        <h2 className="text-2xl font-bold mb-6 text-center text-[#FFFFFF]">{t('Login')}</h2>
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
          {loading ? 'Ingresando...' : t('Login')}
        </button>
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