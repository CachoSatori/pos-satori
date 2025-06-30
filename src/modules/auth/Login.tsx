import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'react-toastify';

const Login: React.FC = () => {
  const { login, loading } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(form.email, form.password);
      navigate('/admin');
    } catch (error: any) {
      toast.error('Error al iniciar sesión. Verifica tus credenciales.');
    }
  };

  return (
    <div className="bg-primary text-text min-h-screen flex items-center justify-center p-8">
      <form
        onSubmit={handleSubmit}
        className="bg-secondary rounded-xl shadow-lg p-8 w-full max-w-sm flex flex-col gap-8"
      >
        <h1 className="text-3xl font-bold mb-2 text-center">Iniciar Sesión</h1>
        <input
          type="email"
          name="email"
          placeholder="Correo electrónico"
          value={form.email}
          onChange={handleChange}
          className="p-4 rounded-xl border border-accent bg-primary text-text placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-accent text-lg"
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Contraseña"
          value={form.password}
          onChange={handleChange}
          className="p-4 rounded-xl border border-accent bg-primary text-text placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-accent text-lg"
          required
        />
        <button
          type="submit"
          className="bg-accent text-text font-bold rounded-xl p-4 shadow-lg hover:bg-accent/80 transition text-lg"
          disabled={loading}
        >
          {loading ? 'Ingresando...' : 'Ingresar'}
        </button>
      </form>
    </div>
  );
};

export default Login;