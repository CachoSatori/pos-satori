import React from 'react';
import { useMesas } from '../../contexts/MesasHook';
import { useAuth } from '../../contexts/AuthHook';
import ProtectedRoute from '../auth/ProtectedRoute';
import type { Table } from '../../types';
import { useTranslation } from 'react-i18next';

/**
 * Componente para administración de mesas.
 */
const AdminMesas: React.FC = () => {
  useAuth();
  const { tables, loading } = useMesas();
  const { t } = useTranslation();

  if (loading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center bg-[#1C2526] text-[#FFFFFF]"
        aria-busy="true"
        role="status"
      >
        <span className="text-xl">{t('Loading...')}</span>
      </div>
    );
  }

  return (
    <ProtectedRoute allowedRoles={['admin', 'waiter']}>
      <div className="min-h-screen p-8 bg-[#1C2526] text-[#FFFFFF]">
        <h1 className="text-4xl font-bold mb-8 text-center text-[#00A6A6]">{t('Table Administration')}</h1>
        <ul>
          {tables.length === 0 && (
            <li className="text-gray-400">{t('No data')}</li>
          )}
          {tables.map((table: Table) => (
            <li key={table.id} className="mb-2">
              {t('Table')} {table.number}: {t(table.status)}
            </li>
          ))}
        </ul>
      </div>
    </ProtectedRoute>
  );
};

export default AdminMesas;

/**
 * Sugerencias de pruebas (Vitest):
 * - Renderiza loading correctamente.
 * - Renderiza lista de mesas.
 * - Accesibilidad: aria-busy y roles correctos.
 */