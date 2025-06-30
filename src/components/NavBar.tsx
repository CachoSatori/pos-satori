import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Logout from '../modules/auth/Logout';

const NavBar: React.FC = () => {
  const { user } = useAuth();

  return (
    <nav className="bg-primary text-text p-4 rounded-xl shadow-lg flex items-center gap-6 mb-8">
      <Link
        to="/"
        className="font-bold px-6 py-3 rounded-xl text-lg hover:bg-accent/20 transition"
      >
        Inicio
      </Link>
      <Link
        to="/dashboard"
        className="font-bold px-6 py-3 rounded-xl text-lg hover:bg-accent/20 transition"
      >
        Dashboard
      </Link>
      <Link
        to="/admin"
        className="font-bold px-6 py-3 rounded-xl text-lg hover:bg-accent/20 transition"
      >
        Productos
      </Link>
      <Link
        to="/mesas"
        className="font-bold px-6 py-3 rounded-xl text-lg hover:bg-accent/20 transition"
      >
        Mesas
      </Link>
      <Link
        to="/orders"
        className="font-bold px-6 py-3 rounded-xl text-lg hover:bg-accent/20 transition"
      >
        Órdenes
      </Link>
      <Link
        to="/filters"
        className="font-bold px-6 py-3 rounded-xl text-lg hover:bg-accent/20 transition"
      >
        Filtros
      </Link>
      <div className="flex-1" />
      {user && (
        <span className="mr-4 px-4 py-2 rounded-xl bg-accent/20 text-accent font-semibold text-base">
          {user.role ? `Rol: ${user.role}` : user.email}
        </span>
      )}
      {user ? (
        <Logout />
      ) : (
        <Link
          to="/login"
          className="bg-accent text-text font-bold px-6 py-3 rounded-xl shadow-lg hover:bg-accent/80 transition text-lg"
        >
          Iniciar Sesión
        </Link>
      )}
    </nav>
  );
};

export default NavBar;