import { Link } from 'react-router-dom';
import logo from './assets/LOGO.jpg';

function App() {
  return (
    <div
      className="bg-primary text-text min-h-screen p-8 flex flex-col items-center justify-center touch-manipulation"
      style={{
        backgroundImage: `url(${logo})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        position: 'relative',
      }}
    >
      <div className="absolute inset-0 bg-primary bg-opacity-80 pointer-events-none" />
      <div className="relative z-10 bg-secondary rounded-xl shadow-lg flex flex-col items-center p-12">
        <h1 className="text-5xl font-bold mb-6 text-center drop-shadow">SatoriPOS - Bienvenido</h1>
        <p className="text-xl mb-10 text-center">Proyecto inicial funcionando</p>
        <div className="flex flex-col md:flex-row gap-6 w-full justify-center">
          <Link
            to="/admin"
            className="bg-accent text-text px-10 py-5 rounded-xl font-bold text-2xl shadow-lg hover:bg-accent/80 transition w-full md:w-auto text-center"
          >
            Administración de Productos
          </Link>
          <Link
            to="/mesas"
            className="bg-accent text-text px-10 py-5 rounded-xl font-bold text-2xl shadow-lg hover:bg-accent/80 transition w-full md:w-auto text-center"
          >
            Administración de Mesas
          </Link>
          <Link
            to="/login"
            className="bg-accent text-text px-10 py-5 rounded-xl font-bold text-2xl shadow-lg hover:bg-accent/80 transition w-full md:w-auto text-center"
          >
            Iniciar Sesión
          </Link>
        </div>
      </div>
    </div>
  );
}

export default App;