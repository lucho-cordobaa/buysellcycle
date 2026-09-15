import api from '../../../app/api/axios';
import type { DetallePresupuesto } from '../types/detalle-presupuesto';
import type { Presupuesto } from '../types/presupuesto';

export async function getPresupuestos(): Promise<Presupuesto[]> {
  const response = await api.get('/presupuesto');
  return response.data;
}

type DetalleItem = {
  productoId: number;
  cantidad: number;
};

type CrearPresupuesto = {
  clienteId: number;
  usuarioId: number;
  detalleItems: DetalleItem[];
};

type PresupuestoConDetalle = {
  presupuesto: Presupuesto;
  detalle: DetallePresupuesto[];
};

export async function createPresupuesto(
  data: CrearPresupuesto,
): Promise<PresupuestoConDetalle> {
  const response = await api.post('/presupuesto', data);
  return response.data;
}

export async function getPresupuestoById(id: number): Promise<Presupuesto> {
  const response = await api.get(`/presupuesto/${id}`);
  return response.data;
}

export async function updatePresupuesto(
  id: number,
  data: Partial<
    Omit<
      Presupuesto,
      'id' | 'archivado' | 'fechaCreacion' | 'fechaActualizacion'
    >
  >,
): Promise<Presupuesto> {
  const response = await api.patch(`/presupuesto/${id}`, data);
  return response.data;
}

export async function deletePresupuesto(id: number): Promise<Presupuesto> {
  const response = await api.delete(`/presupuesto/${id}`);
  return response.data;
}

export async function reactivarPresupuesto(id: number): Promise<Presupuesto> {
  const response = await api.patch(`/presupuesto/${id}/reactivar`);
  return response.data;
}
