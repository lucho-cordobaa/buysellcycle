export interface StockProductoDeposito {
  id: number;
  depositoId: number;
  productoId: number;
  stock: number;
  archivado: boolean;
  fechaCreacion: string;
  fechaActualizacion: string;
}
