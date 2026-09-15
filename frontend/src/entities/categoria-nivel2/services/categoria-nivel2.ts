import api from '../../../app/api/axios';
import type { CategoriaNivel2 } from '../types/categoria-nivel2';

export async function getCategoriasNivel2(): Promise<CategoriaNivel2[]> {
  const response = await api.get('/categoria-nivel2');
  return response.data;
}

export async function createCategoriaNivel2(
  data: Omit<
    CategoriaNivel2,
    'id' | 'archivado' | 'fechaCreacion' | 'fechaActualizacion'
  >,
): Promise<CategoriaNivel2> {
  const response = await api.post('/categoria-nivel2', data);
  return response.data;
}

export async function getCategoriaNivel2ById(
  id: number,
): Promise<CategoriaNivel2> {
  const response = await api.get(`/categoria-nivel2/${id}`);
  return response.data;
}

export async function updateCategoriaNivel2(
  id: number,
  data: Partial<
    Omit<
      CategoriaNivel2,
      'id' | 'archivado' | 'fechaCreacion' | 'fechaActualizacion'
    >
  >,
): Promise<CategoriaNivel2> {
  const response = await api.patch(`/categoria-nivel2/${id}`, data);
  return response.data;
}

export async function deleteCategoriaNivel2(
  id: number,
): Promise<CategoriaNivel2> {
  const response = await api.delete(`/categoria-nivel2/${id}`);
  return response.data;
}

export async function reactivarCategoriaNivel2(
  id: number,
): Promise<CategoriaNivel2> {
  const response = await api.patch(`/categoria-nivel2/${id}/reactivar`);
  return response.data;
}
