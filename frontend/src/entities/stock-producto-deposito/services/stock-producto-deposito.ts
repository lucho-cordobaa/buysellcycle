import api from '../../../app/api/axios';
import type { StockProductoDeposito } from '../types/stock-producto-deposito';

export async function getStockProductoDepositos(): Promise<
  StockProductoDeposito[]
> {
  const response = await api.get('/stock-producto-deposito');
  return response.data;
}

export async function createStockProductoDeposito(
  data: Omit<
    StockProductoDeposito,
    'id' | 'archivado' | 'fechaCreacion' | 'fechaActualizacion'
  >,
): Promise<StockProductoDeposito> {
  const response = await api.post('/stock-producto-deposito', data);
  return response.data;
}

export async function getStockProductoDepositoById(
  id: number,
): Promise<StockProductoDeposito> {
  const response = await api.get(`/stock-producto-deposito/${id}`);
  return response.data;
}

export async function updateStockProductoDeposito(
  id: number,
  data: Partial<
    Omit<
      StockProductoDeposito,
      'id' | 'archivado' | 'fechaCreacion' | 'fechaActualizacion'
    >
  >,
): Promise<StockProductoDeposito> {
  const response = await api.patch(`/stock-producto-deposito/${id}`, data);
  return response.data;
}

export async function deleteStockProductoDeposito(
  id: number,
): Promise<StockProductoDeposito> {
  const response = await api.delete(`/stock-producto-deposito/${id}`);
  return response.data;
}

type IngresoEgresoStock = {
  depositoId: number;
  productoId: number;
  cantidad: number;
};

export async function ingresarStock(
  data: IngresoEgresoStock,
): Promise<StockProductoDeposito> {
  const response = await api.post('/stock-producto-deposito/ingreso', data);
  return response.data;
}

export async function egresoStock(
  data: IngresoEgresoStock,
): Promise<StockProductoDeposito> {
  const response = await api.post('/stock-producto-deposito/egreso', data);
  return response.data;
}

type TransferirStock = {
  depositoOrigenId: number;
  depositoDestinoId: number;
  productoId: number;
  cantidad: number;
};

type TransferenciaResultado = {
  origen: StockProductoDeposito;
  destino: StockProductoDeposito;
};

export async function transferirStock(
  data: TransferirStock,
): Promise<TransferenciaResultado> {
  const response = await api.post(
    '/stock-producto-deposito/transferencia',
    data,
  );
  return response.data;
}

export async function reactivarStockProductoDeposito(
  id: number,
): Promise<StockProductoDeposito> {
  const response = await api.patch(`/stock-producto-deposito/${id}/reactivar`);
  return response.data;
}
