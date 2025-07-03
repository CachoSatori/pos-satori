import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { addDoc, collection, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { toast } from 'react-toastify';
import { db } from '../../firebase';
import { useMesas } from '../../contexts/MesasContext';
import { useAuth } from '../../contexts/useAuth';
import ProtectedRoute from '../auth/ProtectedRoute';
import { Table } from '../../types';

interface TableForm {
  number: number;
  status: 'available' | 'occupied';
}

const AdminMesas: React.FC = () => {
  const { tables, loading } = useMesas();
  useAuth(); // Solo para asegurar contexto, puedes quitar si no usas user
  const [form, setForm] = useState<TableForm>({ number: 0, status: 'available' });
  const [editingId, setEditingId] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleAddOrUpdate = async (e: React.FormEvent) => {
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
    } catch (error) {
      toast.error('Error al guardar mesa');
      console.error(error);
    }
  };

  const handleEdit = (table: Table) => {
    setForm({ number: table.number, status: table.status });
    setEditingId(table.id);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('¿Eliminar esta mesa?')) return;
    try {
      await deleteDoc(doc(db, 'tables', id));
      toast.success('Mesa eliminada');
    } catch (error) {
      toast.error('Error al eliminar mesa');
      console.error(error);
    }
  };

  if (loading) return <div className="text-text">Cargando...</div>;

  return (
    <ProtectedRoute allowedRoles={['admin', 'waiter']}>
      <div className="bg-[#1C2526] text-[#FFFFFF] min-h-screen p-8">
        <div className="flex items-center mb-8">
          <button
            onClick={() => navigate('/')}
            className="bg-[#00A6A6] text-[#FFFFFF] px-6 py-3 rounded-xl font-bold shadow-lg hover:bg-[#009090] focus:ring-2 focus:ring-[#00A6A6] transition"
          >
            ← Volver al Inicio
          </button>
          <h1 className="text-4xl font-bold ml-6 text-[#00A6A6] drop-shadow">Administrar Mesas</h1>
        </div>
        <form
          onSubmit={handleAddOrUpdate}
          className="mb-10 bg-[#16213e] p-8 rounded-xl shadow-lg grid gap-6 max-w-xl mx-auto"
        >
          <input
            type="number"
            name="number"
            placeholder="Número de mesa"
            value={form.number === 0 ? '' : form.number}
            onChange={(e) => setForm({ ...form, number: parseInt(e.target.value, 10) || 0 })}
            className="p-4 rounded-xl border border-[#00A6A6] focus:outline-none focus:ring-2 focus:ring-[#00A6A6] bg-[#1C2526] text-[#FFFFFF] placeholder:text-gray-400 text-lg"
            required
          />
          <select
            name="status"
            value={form.status}
            onChange={(e) => setForm({ ...form, status: e.target.value as 'available' | 'occupied' })}
            className="p-4 rounded-xl border border-[#00A6A6] focus:outline-none focus:ring-2 focus:ring-[#00A6A6] bg-[#1C2526] text-[#FFFFFF] text-lg"
          >
            <option value="available">Disponible</option>
            <option value="occupied">Ocupada</option>
          </select>
          <div className="flex gap-4">
            <button
              type="submit"
              className="flex-1 bg-[#00A6A6] text-[#FFFFFF] p-4 rounded-xl font-bold shadow-lg hover:bg-[#009090] focus:ring-2 focus:ring-[#00A6A6] transition text-lg"
            >
              {editingId ? 'Actualizar' : 'Agregar'} Mesa
            </button>
            {editingId && (
              <button
                type="button"
                className="flex-1 bg-gray-400 text-[#FFFFFF] p-4 rounded-xl font-bold shadow-lg hover:bg-opacity-80 focus:ring-2 focus:ring-gray-400 transition text-lg"
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
          {tables.map((table: Table) => (
            <div
              key={table.id}
              className="bg-[#16213e] p-8 rounded-xl shadow-lg flex flex-col justify-between hover:shadow-2xl transition"
            >
              <div>
                <h2 className="text-2xl font-bold text-[#00A6A6] mb-2">Mesa #{table.number}</h2>
                <p className="mb-2 text-lg">
                  Estado:{' '}
                  <span className={`font-semibold ${table.status === 'available' ? 'text-[#00A6A6]' : 'text-red-500'}`}>
                    {table.status === 'available' ? 'Disponible' : 'Ocupada'}
                  </span>
                </p>
              </div>
              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => handleEdit(table)}
                  style={{
                    padding: '16px',
                    fontSize: '18px',
                    borderRadius: '8px',
                    backgroundColor: table.status === 'available' ? '#00A6A6' : '#1C2526',
                    color: '#FFFFFF',
                    border: '1px solid #00A6A6'
                  }}
                  className="flex-1 font-bold shadow-lg hover:bg-opacity-90 focus:ring-2 focus:ring-[#00A6A6] transition text-lg"
                >
                  Editar
                </button>
                <button
                  onClick={() => handleDelete(table.id)}
                  style={{
                    padding: '16px',
                    fontSize: '18px',
                    borderRadius: '8px',
                    backgroundColor: '#1C2526',
                    color: '#FFFFFF',
                    border: '1px solid #00A6A6'
                  }}
                  className="flex-1 font-bold shadow-lg hover:bg-opacity-90 focus:ring-2 focus:ring-red-500 transition text-lg"
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