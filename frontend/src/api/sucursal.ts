import api from '../api/axios';
import type { Sucursal } from '../types/sucursal';

export async function getSucursales(): Promise<Sucursal[]> {
  const response = await api.get('/sucursal');
  return response.data;
}

export async function createSucursal(
  data: Omit<
    Sucursal,
    'id' | 'archivado' | 'fechaCreacion' | 'fechaActualizacion'
  >,
): Promise<Sucursal> {
  const response = await api.post('/sucursal', data);
  return response.data;
}

export async function getSucursalById(id: number): Promise<Sucursal> {
  const response = await api.get(`/sucursal/${id}`);
  return response.data;
}

export async function updateSucursal(
  id: number,
  data: Partial<
    Omit<Sucursal, 'id' | 'archivado' | 'fechaCreacion' | 'fechaActualizacion'>
  >,
): Promise<Sucursal> {
  const response = await api.patch(`/sucursal/${id}`, data);
  return response.data;
}

export async function deleteSucursal(id: number): Promise<Sucursal> {
  const response = await api.delete(`/sucursal/${id}`);
  return response.data;
}

export async function reactivarSucursal(id: number): Promise<Sucursal> {
  const response = await api.patch(`/sucursal/${id}/reactivar`);
  return response.data;
}
