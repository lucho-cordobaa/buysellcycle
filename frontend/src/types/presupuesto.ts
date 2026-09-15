import type { Cliente } from './cliente';
import type { Usuario } from './usuario';
import type { DetallePresupuesto } from './detalle-presupuesto';

export type EstadoPresupuesto =
  'PENDIENTE' | 'ACEPTADO' | 'RECHAZADO' | 'VENCIDO';

export interface Presupuesto {
  id: number;
  cliente: Cliente;
  clienteId: number;
  usuario: Usuario;
  usuarioId: number;
  total: string;
  estado: EstadoPresupuesto;
  archivado: boolean;
  fechaCreacion: string;
  fechaActualizacion: string;
  detallePresupuesto: DetallePresupuesto[];
}
