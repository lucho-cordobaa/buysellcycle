import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateStockProductoDepositoDto } from './dto/create-stock-producto-deposito.dto';
import { UpdateStockProductoDepositoDto } from './dto/update-stock-producto-deposito.dto';
import { IngresoStockDto } from './dto/ingreso-stock.dto';
import { TransferenciaStockDto } from './dto/transferencia-stock.dto';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '../../generated/prisma/client';

@Injectable()
export class StockProductoDepositoService {
  constructor(private prisma: PrismaService) {}

  async create(createStockProductoDepositoDto: CreateStockProductoDepositoDto) {
    return this.prisma.$transaction(async (tx) => {
      try {
        const stockCreado = await tx.stockProductoDeposito.create({
          data: createStockProductoDepositoDto,
        });

        await this.recalcularStockTotal(stockCreado.productoId, tx);

        return stockCreado;
      } catch (error) {
        if (
          error instanceof Prisma.PrismaClientKnownRequestError &&
          error.code === 'P2002'
        ) {
          throw new BadRequestException(
            'Ya existe un registro de stock para ese producto en ese depósito',
          );
        }
        throw error;
      }
    });
  }

  findAll() {
    return this.prisma.stockProductoDeposito.findMany();
  }

  findOne(id: number) {
    return this.prisma.stockProductoDeposito.findUnique({ where: { id } });
  }

  async update(
    id: number,
    updateStockProductoDepositoDto: UpdateStockProductoDepositoDto,
  ) {
    return this.prisma.$transaction(async (tx) => {
      try {
        const stockAnterior = await tx.stockProductoDeposito.findUniqueOrThrow({
          where: { id },
        });
        const stockActualizado = await tx.stockProductoDeposito.update({
          where: { id },
          data: updateStockProductoDepositoDto,
        });

        if (stockAnterior.productoId !== stockActualizado.productoId) {
          await this.recalcularStockTotal(stockAnterior.productoId, tx);
        }
        await this.recalcularStockTotal(stockActualizado.productoId, tx);

        return stockActualizado;
      } catch (error) {
        if (
          error instanceof Prisma.PrismaClientKnownRequestError &&
          error.code === 'P2002'
        ) {
          throw new BadRequestException(
            'Ya existe un registro de stock para ese producto en ese depósito',
          );
        }
        throw error;
      }
    });
  }

  async remove(id: number) {
    return this.prisma.$transaction(async (tx) => {
      const stockArchivado = await tx.stockProductoDeposito.update({
        where: { id },
        data: { archivado: true },
      });

      await this.recalcularStockTotal(stockArchivado.productoId, tx);
      return stockArchivado;
    });
  }

  private async actualizarFechaMovimiento(
    productoId: number,
    tx: Prisma.TransactionClient,
  ) {
    await tx.producto.update({
      where: { id: productoId },
      data: { fechaHoraUltimoMovimientoStock: new Date() },
    });
  }

  async ingresarStock(ingresoDto: IngresoStockDto) {
    const { depositoId, productoId, cantidad } = ingresoDto;

    return this.prisma.$transaction(async (tx) => {
      const stockActualizado = await tx.stockProductoDeposito.upsert({
        where: { depositoId_productoId: { depositoId, productoId } },
        update: { stock: { increment: cantidad }, archivado: false },
        create: { depositoId, productoId, stock: cantidad },
      });

      await this.recalcularStockTotal(productoId, tx);
      await this.actualizarFechaMovimiento(productoId, tx);
      return stockActualizado;
    });
  }

  async egresarStock(egresoDto: IngresoStockDto) {
    const { depositoId, productoId, cantidad } = egresoDto;

    return this.prisma.$transaction(async (tx) => {
      const resultado = await tx.stockProductoDeposito.updateMany({
        where: {
          depositoId,
          productoId,
          archivado: false,
          stock: { gte: cantidad },
        },
        data: { stock: { decrement: cantidad } },
      });

      if (resultado.count === 0) {
        throw new BadRequestException('Stock insuficiente');
      }

      const stockActualizado = await tx.stockProductoDeposito.findUnique({
        where: { depositoId_productoId: { depositoId, productoId } },
      });

      await this.recalcularStockTotal(productoId, tx);
      await this.actualizarFechaMovimiento(productoId, tx);

      return stockActualizado;
    });
  }

  async transferirStock(dto: TransferenciaStockDto) {
    const { depositoOrigenId, depositoDestinoId, productoId, cantidad } = dto;

    if (depositoOrigenId === depositoDestinoId) {
      throw new BadRequestException(
        'El depósito de origen y destino deben ser distintos',
      );
    }

    return this.prisma.$transaction(async (tx) => {
      const resultadoOrigen = await tx.stockProductoDeposito.updateMany({
        where: {
          depositoId: depositoOrigenId,
          productoId,
          archivado: false,
          stock: { gte: cantidad },
        },
        data: { stock: { decrement: cantidad } },
      });

      if (resultadoOrigen.count === 0) {
        throw new BadRequestException(
          'Stock insuficiente en el depósito de origen',
        );
      }

      await tx.stockProductoDeposito.upsert({
        where: {
          depositoId_productoId: { depositoId: depositoDestinoId, productoId },
        },
        update: { stock: { increment: cantidad }, archivado: false },
        create: { depositoId: depositoDestinoId, productoId, stock: cantidad },
      });

      await this.actualizarFechaMovimiento(productoId, tx);
      await this.recalcularStockTotal(productoId, tx);

      const origenActualizado = await tx.stockProductoDeposito.findUnique({
        where: {
          depositoId_productoId: { depositoId: depositoOrigenId, productoId },
        },
      });

      const destinoActualizado = await tx.stockProductoDeposito.findUnique({
        where: {
          depositoId_productoId: { depositoId: depositoDestinoId, productoId },
        },
      });

      return {
        origen: origenActualizado,
        destino: destinoActualizado,
      };
    });
  }

  private async recalcularStockTotal(
    productoId: number,
    tx: Prisma.TransactionClient,
  ) {
    const resultado = await tx.stockProductoDeposito.aggregate({
      where: { productoId, archivado: false },
      _sum: { stock: true },
    });

    const stockTotal = resultado._sum.stock || 0;

    await tx.producto.update({
      where: { id: productoId },
      data: {
        stockTotal,
        ...(stockTotal > 0 ? { estado: 'DISPONIBLE' } : {}),
      },
    });
  }

  async reactivar(id: number) {
    return this.prisma.$transaction(async (tx) => {
      const stockReactivado = await tx.stockProductoDeposito.update({
        where: { id },
        data: { archivado: false },
      });

      await this.recalcularStockTotal(stockReactivado.productoId, tx);

      return stockReactivado;
    });
  }
}
