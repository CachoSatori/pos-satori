import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { addDoc, collection, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { toast } from 'react-toastify';
import { db, logError } from '../../services/firebase';
import { useMesas } from '../../contexts/MesasContext';
import { useAuth } from '../../contexts/AuthContext';
import ProtectedRoute from '../auth/ProtectedRoute';
import { Table } from '../../types';

interface TableForm {
  number: number;
  status: 'available' | 'occupied';
}

const AdminMesas: React.FC = () => {
  const { tables, loading } = useMesas();
  const { user } = useAuth();
  const [form, setForm] = useState<TableForm>({ number: 0, status: 'available' });
  const [editingId, setEditingId] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleAddOrUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!form.number) {
      toast.error('El número de mesa es requerido');
      return;
    }
    try {
      if (editingId) {
        const tableRef = doc(db, 'tables', editingId);
        await updateDoc(tableRef, { ...form });
        toast.success('Mesa actualizada');
      } else {
        await addDoc(collection(db, 'tables'), { ...form });
        toast.success('Mesa agregada');
      }
      setForm({ number: 0, status: 'available' });
      setEditingId(null);
    } catch (error: unknown) {
      toast.error('Error al guardar mesa');
      logError(error as Error);
    }
  };

  const handleEdit = (table: Table) => {
    setForm({ number: Number(table.number), status: table.status === 'occupied' ? 'occupied' : 'available' });
    setEditingId(table.id);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('¿Eliminar esta mesa?')) return;
    try {
      await deleteDoc(doc(db, 'tables', id));
      toast.success('Mesa eliminada');
    } catch (error: unknown) {
      toast.error('Error al eliminar mesa');
      logError(error as Error);
    }
  };

  if (loading) return <div className="text-text">Cargando...</div>;

  return (
    <ProtectedRoute>
      <div className="bg-primary text-text min-h-screen p-8">
        <div className="flex items-center mb-8">
          <button
            onClick={() => navigate('/')}
            className="bg-accent text-text px-6 py-3 rounded-xl font-bold shadow-lg hover:bg-accent/80 focus:ring-2 focus:ring-accent transition"
          >
            ← Volver al Inicio
          </button>
          <h1 className="text-4xl font-bold ml-6 text-accent drop-shadow">Administrar Mesas</h1>
        </div>
        <form
          onSubmit={handleAddOrUpdate}
          className="mb-10 bg-secondary p-8 rounded-xl shadow-lg grid gap-6 max-w-xl mx-auto"
        >
          <input
            type="number"
            name="number"
            placeholder="Número de mesa"
            value={form.number === 0 ? '' : form.number}
            onChange={(e) => setForm({ ...form, number: parseInt(e.target.value, 10) || 0 })}
            className="p-4 rounded-xl border border-accent focus:outline-none focus:ring-2 focus:ring-accent bg-primary text-text placeholder:text-gray-400 text-lg"
            required
          />
          <select
            name="status"
            value={form.status}
            onChange={(e) => setForm({ ...form, status: e.target.value as 'available' | 'occupied' })}
            className="p-4 rounded-xl border border-accent focus:outline-none focus:ring-2 focus:ring-accent bg-primary text-text text-lg"
          >
            <option value="available">Disponible</option>
            <option value="occupied">Ocupada</option>
          </select>
          <div className="flex gap-4">
            <button
              type="submit"
              className="flex-1 bg-accent text-text p-4 rounded-xl font-bold shadow-lg hover:bg-opacity-90 focus:ring-2 focus:ring-accent transition text-lg"
            >
              {editingId ? 'Actualizar' : 'Agregar'} Mesa
            </button>
            {editingId && (
              <button
                type="button"
                className="flex-1 bg-gray-400 text-text p-4 rounded-xl font-bold shadow-lg hover:bg-opacity-80 focus:ring-2 focus:ring-gray-400 transition text-lg"
                onClick={() => {
                  setForm({ number: 0, status: 'available' });
                  setEditingId(null);
                }}
              >
                Cancelar
              </button>
            )}
          </div>
        </form>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {tables.map((table) => (
            <div
              key={table.id}
              className="bg-secondary p-8 rounded-xl shadow-lg flex flex-col justify-between hover:shadow-2xl transition"
            >
              <div>
                <h2 className="text-2xl font-bold text-accent mb-2">Mesa #{table.number}</h2>
                <p className="mb-2 text-lg">
                  Estado:{' '}
                  <span className={`font-semibold ${table.status === 'available' ? 'text-accent' : 'text-danger'}`}>
                    {table.status === 'available' ? 'Disponible' : 'Ocupada'}
                  </span>
                </p>
              </div>
              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => handleEdit(table)}
                  className="flex-1 bg-accent text-text p-3 rounded-xl font-bold hover:bg-opacity-90 focus:ring-2 focus:ring-accent transition text-lg"
                >
                  Editar
                </button>
                <button
                  onClick={() => handleDelete(table.id)}
                  className="flex-1 bg-danger text-text p-3 rounded-xl font-bold hover:bg-opacity-90 focus:ring-2 focus:ring-danger transition text-lg"
                >
                  Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default AdminMesas;