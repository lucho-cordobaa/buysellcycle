import api from '../../../app/api/axios';
import type { Proveedor } from '../types/proveedor';

export async function getProveedores(): Promise<Proveedor[]> {
  const response = await api.get('/proveedor');
  return response.data;
}

export async function createProveedor(
  data: Omit<
    Proveedor,
    'id' | 'archivado' | 'fechaCreacion' | 'fechaActualizacion'
  >,
): Promise<Proveedor> {
  const response = await api.post('/proveedor', data);
  return response.data;
}

export async function getProveedorById(id: number): Promise<Proveedor> {
  const response = await api.get(`/proveedor/${id}`);
  return response.data;
}

export async function updateProveedor(
  id: number,
  data: Partial<
    Omit<Proveedor, 'id' | 'archivado' | 'fechaCreacion' | 'fechaActualizacion'>
  >,
): Promise<Proveedor> {
  const response = await api.patch(`/proveedor/${id}`, data);
  return response.data;
}

export async function deleteProveedor(id: number): Promise<Proveedor> {
  const response = await api.delete(`/proveedor/${id}`);
  return response.data;
}

export async function reactivarProveedor(id: number): Promise<Proveedor> {
  const response = await api.patch(`/proveedor/${id}/reactivar`);
  return response.data;
}
