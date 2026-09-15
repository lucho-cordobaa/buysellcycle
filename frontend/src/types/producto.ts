export type Estado = 'DISPONIBLE' | 'ACTIVO' | 'INACTIVO';

export interface Producto {
  id: number;
  nombre: string;
  stockTotal: number;
  costoNeto: string;
  utilidad: string;
  precioLista: string;
  descuentoContado: string;
  precioContado: string;
  estado: Estado;
  fechaHoraUltimoMovimientoStock: string;
  fechaHoraUltimaSincronizacionStock: string;
  rutaImagenStorage?: string;
  marcaId: number;
  categoriaNivel2Id: number;
  archivado: boolean;
  fechaCreacion: string;
  fechaActualizacion: string;
}
