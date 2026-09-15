export type Rol = 'Administracion' | 'Vendedor';

export interface Usuario {
  id: number;
  nombre: string;
  apellido: string;
  dni: string;
  rol: Rol;
  nombreUsuario: string;
  sucursalId: number;
  archivado: boolean;
  fechaCreacion: string;
  fechaActualizacion: string;
}
