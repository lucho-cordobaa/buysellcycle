export interface Cliente {
  id: number;
  nombre: string;
  apellido: string;
  dni: string;
  email: string;
  provinciaId: number;
  localidadId: number;
  archivado: boolean;
  fechaCreacion: string;
  fechaActualizacion: string;
}
