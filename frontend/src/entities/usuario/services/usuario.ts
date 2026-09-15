import api from '../../../app/api/axios';
import type { Usuario } from '../types/usuario';

export async function getUsuarios(): Promise<Usuario[]> {
  const response = await api.get('/usuario');
  return response.data;
}

export async function createUsuario(
  data: Omit<
    Usuario,
    'id' | 'archivado' | 'fechaCreacion' | 'fechaActualizacion'
  >,
): Promise<Usuario> {
  const response = await api.post('/usuario', data);
  return response.data;
}

export async function getUsuarioById(id: number): Promise<Usuario> {
  const response = await api.get(`/usuario/${id}`);
  return response.data;
}

export async function updateUsuario(
  id: number,
  data: Partial<
    Omit<Usuario, 'id' | 'archivado' | 'fechaCreacion' | 'fechaActualizacion'>
  >,
): Promise<Usuario> {
  const response = await api.patch(`/usuario/${id}`, data);
  return response.data;
}

export async function deleteUsuario(id: number): Promise<Usuario> {
  const response = await api.delete(`/usuario/${id}`);
  return response.data;
}

export async function reactivarUsuario(id: number): Promise<Usuario> {
  const response = await api.patch(`/usuario/${id}/reactivar`);
  return response.data;
}
