import api from '../../../app/api/axios';
import type { Producto } from '../types/producto';

export async function getProductos(): Promise<Producto[]> {
  const response = await api.get('/producto');
  return response.data;
}

type CreateProductoData = {
  nombre: string;
  costoNeto: number;
  utilidad: number;
  descuentoContado: number;
  marcaId: number;
  categoriaNivel2Id: number;
};

export async function createProducto(
  data: CreateProductoData,
): Promise<Producto> {
  const response = await api.post('/producto', data);
  return response.data;
}

export async function getProductoById(id: number): Promise<Producto> {
  const response = await api.get(`/producto/${id}`);
  return response.data;
}

export async function updateProducto(
  id: number,
  data: Partial<CreateProductoData>,
): Promise<Producto> {
  const response = await api.patch(`/producto/${id}`, data);
  return response.data;
}

export async function deleteProducto(id: number): Promise<Producto> {
  const response = await api.delete(`/producto/${id}`);
  return response.data;
}

export async function actualizarEstadosProducto(): Promise<void> {
  await api.post('/producto/actualizar-estados');
}

export async function reactivarProducto(id: number): Promise<Producto> {
  const response = await api.patch(`/producto/${id}/reactivar`);
  return response.data;
}
