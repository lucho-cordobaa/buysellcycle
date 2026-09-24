import api from '../../../app/api/axios';
import type { Deposito } from '../types/deposito';

export async function getDepositos(): Promise<Deposito[]> {
  const response = await api.get('/deposito');
  return response.data;
}

export async function createDeposito(
  data: Omit<
    Deposito,
    'id' | 'codigo' | 'archivado' | 'fechaCreacion' | 'fechaActualizacion'
  >,
): Promise<Deposito> {
  const response = await api.post('/deposito', data);
  return response.data;
}

export async function getDepositoById(id: number): Promise<Deposito> {
  const response = await api.get(`/deposito/${id}`);
  return response.data;
}

export async function updateDeposito(
  id: number,
  data: Partial<
    Omit<
      Deposito,
      'id' | 'codigo' | 'archivado' | 'fechaCreacion' | 'fechaActualizacion'
    >
  >,
): Promise<Deposito> {
  const response = await api.patch(`/deposito/${id}`, data);
  return response.data;
}

export async function deleteDeposito(id: number): Promise<Deposito> {
  const response = await api.delete(`/deposito/${id}`);
  return response.data;
}

export async function reactivarDeposito(id: number): Promise<Deposito> {
  const response = await api.patch(`/deposito/${id}/reactivar`);
  return response.data;
}
