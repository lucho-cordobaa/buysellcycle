import api from '../api/axios';
import type { Cliente } from '../types/cliente';

export async function getClientes(): Promise<Cliente[]> {
  const response = await api.get('/cliente');
  return response.data;
}

export async function createCliente(
  data: Omit<
    Cliente,
    'id' | 'archivado' | 'fechaCreacion' | 'fechaActualizacion'
  >,
): Promise<Cliente> {
  const response = await api.post('/cliente', data);
  return response.data;
}

export async function getClienteById(id: number): Promise<Cliente> {
  const response = await api.get(`/cliente/${id}`);
  return response.data;
}

export async function updateCliente(
  id: number,
  data: Partial<
    Omit<Cliente, 'id' | 'archivado' | 'fechaCreacion' | 'fechaActualizacion'>
  >,
): Promise<Cliente> {
  const response = await api.patch(`/cliente/${id}`, data);
  return response.data;
}

export async function deleteCliente(id: number): Promise<Cliente> {
  const response = await api.delete(`/cliente/${id}`);
  return response.data;
}

export async function reactivarCliente(id: number): Promise<Cliente> {
  const response = await api.patch(`/cliente/${id}/reactivar`);
  return response.data;
}
