import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthHook';
import { useTranslation } from 'react-i18next';
<<<<<<< HEAD
import { getAuth } from 'firebase/auth';
import { FirebaseError } from 'firebase/app';
=======
import { getAuth, FirebaseError } from 'firebase/auth';
>>>>>>> e7873d4861da77c7c58f9e0232b79d7ff80eeabd
import { logError } from '../../firebase';

/**
 * Componente de Login.
 * Permite autenticación de usuario y muestra feedback.
 */
const Login: React.FC = () => {
  const { login, loading, user } = useAuth();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.name === 'email') setEmail(e.target.value);
    if (e.target.name === 'password') setPassword(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (error) {
<<<<<<< HEAD
      const errorMessage = (error as FirebaseError).code === 'auth/wrong-password' 
        ? t('Invalid credentials') 
        : t('Login failed');
      setError(errorMessage);
      logError({ 
        error: error as FirebaseError, 
        context: 'Login', 
        details: `Código: ${(error as FirebaseError).code || 'N/A'}, Mensaje: ${(error as FirebaseError).message || 'N/A'}` 
=======
      setError(t('Login failed'));
      logError({
        error: error as FirebaseError,
        context: 'Login',
        details: `Código: ${(error as FirebaseError).code || 'N/A'}, Mensaje: ${(error as FirebaseError).message || 'N/A'}`
>>>>>>> e7873d4861da77c7c58f9e0232b79d7ff80eeabd
      });
    }
  };

  const renovarToken = async () => {
    try {
      const auth = getAuth();
      if (auth.currentUser) {
        await auth.currentUser.getIdToken(true);
        console.log('Token renovado');
      } else {
        console.log('No hay usuario autenticado');
      }
    } catch (error) {
<<<<<<< HEAD
      logError({ 
        error: error as FirebaseError, 
        context: 'Login', 
        details: `Código: ${(error as FirebaseError).code || 'N/A'}, Mensaje: ${(error as FirebaseError).message || 'N/A'}` 
=======
      logError({
        error: error as FirebaseError,
        context: 'Login',
        details: `Código: ${(error as FirebaseError).code || 'N/A'}, Mensaje: ${(error as FirebaseError).message || 'N/A'}`
>>>>>>> e7873d4861da77c7c58f9e0232b79d7ff80eeabd
      });
    }
  };

  if (user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#1C2526] text-[#FFFFFF]">
        <div className="p-8 rounded-xl bg-[#00A6A6] text-[#1C2526] font-bold text-xl">
          {t('Already logged in')}
          <button
            onClick={renovarToken}
            className="mt-4 bg-[#FFFFFF] text-[#1C2526] font-bold rounded-xl p-2"
          >
            {t('Renovar token')}
          </button>
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
 * - Redirecciona a /dashboard tras login exitoso.
 * - Muestra mensaje de error para credenciales inválidas.
 * - Accesibilidad: aria-labels presentes.
 */
