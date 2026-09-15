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

  create(createStockProductoDepositoDto: CreateStockProductoDepositoDto) {
    return this.prisma.stockProductoDeposito.create({
      data: createStockProductoDepositoDto,
    });
  }

  findAll() {
    return this.prisma.stockProductoDeposito.findMany();
  }

  findOne(id: number) {
    return this.prisma.stockProductoDeposito.findUnique({ where: { id } });
  }

  update(
    id: number,
    updateStockProductoDepositoDto: UpdateStockProductoDepositoDto,
  ) {
    return this.prisma.stockProductoDeposito.update({
      where: { id },
      data: updateStockProductoDepositoDto,
    });
  }

  remove(id: number) {
    return this.prisma.stockProductoDeposito.update({
      where: { id },
      data: { archivado: true },
    });
  }

  async ingresarStock(ingresoDto: IngresoStockDto) {
    const { depositoId, productoId, cantidad } = ingresoDto;

    return this.prisma.$transaction(async (tx) => {
      const stockActualizado = await tx.stockProductoDeposito.upsert({
        where: { depositoId_productoId: { depositoId, productoId } },
        update: { stock: { increment: cantidad } },
        create: { depositoId, productoId, stock: cantidad },
      });

      await this.recalcularStockTotal(productoId, tx);
      return stockActualizado;
    });
  }

  async egresarStock(egresoDto: IngresoStockDto) {
    const { depositoId, productoId, cantidad } = egresoDto;

    const stockActual = await this.prisma.stockProductoDeposito.findUnique({
      where: { depositoId_productoId: { depositoId, productoId } },
    });

    if (stockActual === null || stockActual.stock < cantidad) {
      throw new BadRequestException('Stock insuficiente');
    }

    return this.prisma.$transaction(async (tx) => {
      const stockActualizado = await tx.stockProductoDeposito.update({
        where: { depositoId_productoId: { depositoId, productoId } },
        data: { stock: { decrement: cantidad } },
      });

      await this.recalcularStockTotal(productoId, tx);
      return stockActualizado;
    });
  }

  async transferirStock(dto: TransferenciaStockDto) {
    const { depositoOrigenId, depositoDestinoId, productoId, cantidad } = dto;

    const stockOrigen = await this.prisma.stockProductoDeposito.findUnique({
      where: {
        depositoId_productoId: { depositoId: depositoOrigenId, productoId },
      },
    });

    if (stockOrigen === null || stockOrigen.stock < cantidad) {
      throw new BadRequestException(
        'Stock insuficiente en el depósito de origen',
      );
    }

    await this.prisma.$transaction(async (tx) => {
      await tx.stockProductoDeposito.update({
        where: {
          depositoId_productoId: { depositoId: depositoOrigenId, productoId },
        },
        data: { stock: { decrement: cantidad } },
      });
      await tx.stockProductoDeposito.upsert({
        where: {
          depositoId_productoId: { depositoId: depositoDestinoId, productoId },
        },
        update: { stock: { increment: cantidad } },
        create: { depositoId: depositoDestinoId, productoId, stock: cantidad },
      });
    });

    const origenActualizado =
      await this.prisma.stockProductoDeposito.findUnique({
        where: {
          depositoId_productoId: { depositoId: depositoOrigenId, productoId },
        },
      });

    const destinoActualizado =
      await this.prisma.stockProductoDeposito.findUnique({
        where: {
          depositoId_productoId: { depositoId: depositoDestinoId, productoId },
        },
      });

    return {
      origen: origenActualizado,
      destino: destinoActualizado,
    };
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
      data: { stockTotal },
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
