import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Logout from '../modules/auth/Logout';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

const NavBar: React.FC = () => {
  const { user } = useAuth();
  const [role, setRole] = useState<string>('');

  useEffect(() => {
    if (user) {
      getDoc(doc(db, 'users', user.uid))
        .then((docSnap) => {
          if (docSnap.exists()) {
            setRole(docSnap.data()?.role || 'Usuario');
          } else {
            setRole('Usuario');
          }
        })
        .catch((error) => {
          toast.error('Error al cargar rol de usuario');
          logError(error);
        });
    } else {
      setRole('');
    }
  }, [user]);

  return (
    <nav className="bg-primary text-text p-6 rounded-xl shadow-lg flex justify-between items-center">
      <div className="flex gap-8">
        <Link
          to="/"
          className="text-2xl font-bold hover:text-accent hover:scale-105 transition"
        >
          SatoriPOS
        </Link>
        {user && (
          <>
            <Link
              to="/dashboard"
              className="text-2xl hover:text-accent hover:scale-105 transition"
            >
              Dashboard
            </Link>
            <Link
              to="/admin"
              className="text-2xl hover:text-accent hover:scale-105 transition"
            >
              Productos
            </Link>
            <Link
              to="/mesas"
              className="text-2xl hover:text-accent hover:scale-105 transition"
            >
              Mesas
            </Link>
            <Link
              to="/orders"
              className="text-2xl hover:text-accent hover:scale-105 transition"
            >
              Órdenes
            </Link>
            <Link
              to="/notifications"
              className="text-2xl hover:text-accent hover:scale-105 transition"
            >
              Notificaciones
            </Link>
          </>
        )}
      </div>
      <div className="flex items-center gap-6">
        {user && <span className="text-xl font-semibold">{role}</span>}
        {user ? (
          <Logout />
        ) : (
          <Link
            to="/login"
            className="bg-accent text-text p-6 rounded-lg font-bold text-2xl hover:bg-opacity-80 hover:scale-105 transition shadow-lg"
          >
            Iniciar Sesión
          </Link>
        )}
      </div>
    </nav>
  );
};

export default NavBar;
