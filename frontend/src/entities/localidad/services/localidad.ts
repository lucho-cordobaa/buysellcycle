import api from '../../../app/api/axios';
import type { Localidad } from '../types/localidad';

export async function getLocalidades(): Promise<Localidad[]> {
  const response = await api.get('/localidad');
  return response.data;
}

export async function createLocalidad(
  data: Omit<
    Localidad,
    'id' | 'archivado' | 'fechaCreacion' | 'fechaActualizacion'
  >,
): Promise<Localidad> {
  const response = await api.post('/localidad', data);
  return response.data;
}

export async function getLocalidadById(id: number): Promise<Localidad> {
  const response = await api.get(`/localidad/${id}`);
  return response.data;
}

export async function updateLocalidad(
  id: number,
  data: Partial<
    Omit<Localidad, 'id' | 'archivado' | 'fechaCreacion' | 'fechaActualizacion'>
  >,
): Promise<Localidad> {
  const response = await api.patch(`/localidad/${id}`, data);
  return response.data;
}

export async function deleteLocalidad(id: number): Promise<Localidad> {
  const response = await api.delete(`/localidad/${id}`);
  return response.data;
}

export async function reactivarLocalidad(id: number): Promise<Localidad> {
  const response = await api.patch(`/localidad/${id}/reactivar`);
  return response.data;
}
