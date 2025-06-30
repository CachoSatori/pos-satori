import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const Logout: React.FC = () => {
  const { logout, loading } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch {
      // Error handled by AuthContext (toast)
    }
  };

  return (
    <button
      onClick={handleLogout}
      disabled={loading}
      className="bg-accent text-text p-3 rounded-lg font-bold shadow-md hover:bg-accent/80 transition"
    >
      {loading ? 'Cerrando sesión...' : 'Cerrar Sesión'}
    </button>
  );
};

export default Logout;