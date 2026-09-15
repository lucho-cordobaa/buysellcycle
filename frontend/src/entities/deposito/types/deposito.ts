export interface Deposito {
  id: number;
  codigo: string;
  nombre: string;
  provinciaId: number;
  localidadId: number;
  archivado: boolean;
  fechaCreacion: string;
  fechaActualizacion: string;
}
