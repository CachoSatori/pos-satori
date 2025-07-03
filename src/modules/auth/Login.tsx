import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/useAuth';
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
    <div
      className="min-h-screen flex items-center justify-center"
      style={{
        background: 'linear-gradient(135deg, #1C2526 0%, #00A6A6 100%)',
      }}
    >
      <form
        onSubmit={handleSubmit}
        className="bg-[#1C2526] rounded-2xl shadow-2xl p-10 w-full max-w-md flex flex-col gap-8 border-4 border-[#00A6A6]"
      >
        <h1 className="text-4xl font-extrabold mb-2 text-center text-[#00A6A6] drop-shadow">SatoriPOS</h1>
        <h2 className="text-2xl font-bold mb-6 text-center text-[#FFFFFF]">Iniciar Sesión</h2>
        <input
          type="email"
          name="email"
          placeholder="Correo electrónico"
          value={form.email}
          onChange={handleChange}
          className="p-4 rounded-xl border-2 border-[#00A6A6] bg-[#1C2526] text-[#FFFFFF] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#00A6A6] text-lg"
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Contraseña"
          value={form.password}
          onChange={handleChange}
          className="p-4 rounded-xl border-2 border-[#00A6A6] bg-[#1C2526] text-[#FFFFFF] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#00A6A6] text-lg"
          required
        />
        <button
          type="submit"
          className="bg-[#00A6A6] text-[#FFFFFF] font-bold rounded-xl p-4 shadow-lg hover:bg-[#009090] transition text-lg"
          disabled={loading}
        >
          {loading ? 'Ingresando...' : 'Ingresar'}
        </button>
      </form>
    </div>
  );
};

export default Login;