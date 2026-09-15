import api from '../../../app/api/axios';
import type { Marca } from '../types/marca';

export async function getMarcas(): Promise<Marca[]> {
  const response = await api.get('/marca');
  return response.data;
}

export async function createMarca(nombre: string): Promise<Marca> {
  const response = await api.post('/marca', { nombre });
  return response.data;
}

export async function getMarcaById(id: number): Promise<Marca> {
  const response = await api.get(`/marca/${id}`);
  return response.data;
}

export async function updateMarca(id: number, nombre: string): Promise<Marca> {
  const response = await api.patch(`/marca/${id}`, { nombre });
  return response.data;
}

export async function deleteMarca(id: number): Promise<Marca> {
  const response = await api.delete(`/marca/${id}`);
  return response.data;
}

export async function reactivarMarca(id: number): Promise<Marca> {
  const response = await api.patch(`/marca/${id}/reactivar`);
  return response.data;
}
