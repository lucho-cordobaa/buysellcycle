import api from '../../../app/api/axios';
import type { Provincia } from '../types/provincia';

export async function getProvincias(): Promise<Provincia[]> {
  const response = await api.get('/provincia');
  return response.data;
}

export async function createProvincia(
  data: Omit<
    Provincia,
    'id' | 'archivado' | 'fechaCreacion' | 'fechaActualizacion'
  >,
): Promise<Provincia> {
  const response = await api.post('/provincia', data);
  return response.data;
}

export async function getProvinciaById(id: number): Promise<Provincia> {
  const response = await api.get(`/provincia/${id}`);
  return response.data;
}

export async function updateProvincia(
  id: number,
  data: Partial<
    Omit<Provincia, 'id' | 'archivado' | 'fechaCreacion' | 'fechaActualizacion'>
  >,
): Promise<Provincia> {
  const response = await api.patch(`/provincia/${id}`, data);
  return response.data;
}

export async function deleteProvincia(id: number): Promise<Provincia> {
  const response = await api.delete(`/provincia/${id}`);
  return response.data;
}

export async function reactivarProvincia(id: number): Promise<Provincia> {
  const response = await api.patch(`/provincia/${id}/reactivar`);
  return response.data;
}
