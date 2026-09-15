import api from '../../../app/api/axios';
import type { CategoriaNivel1 } from '../types/categoria-nivel1';

export async function getCategoriasNivel1(): Promise<CategoriaNivel1[]> {
  const response = await api.get('/categoria-nivel1');
  return response.data;
}

export async function createCategoriaNivel1(
  nombre: string,
): Promise<CategoriaNivel1> {
  const response = await api.post('/categoria-nivel1', { nombre });
  return response.data;
}

export async function getCategoriasNivel1ConNivel2(): Promise<
  CategoriaNivel1[]
> {
  const response = await api.get('/categoria-nivel1/categorias');
  return response.data;
}

export async function getCategoriaNivel1ById(
  id: number,
): Promise<CategoriaNivel1> {
  const response = await api.get(`/categoria-nivel1/${id}`);
  return response.data;
}

export async function updateCategoriaNivel1(
  id: number,
  nombre: string,
): Promise<CategoriaNivel1> {
  const response = await api.patch(`/categoria-nivel1/${id}`, { nombre });
  return response.data;
}

export async function deleteCategoriaNivel1(
  id: number,
): Promise<CategoriaNivel1> {
  const response = await api.delete(`/categoria-nivel1/${id}`);
  return response.data;
}

export async function reactivarCategoriaNivel1(
  id: number,
): Promise<CategoriaNivel1> {
  const response = await api.patch(`/categoria-nivel1/${id}/reactivar`);
  return response.data;
}
