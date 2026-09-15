import { Injectable, BadRequestException } from '@nestjs/common';
import { CreateProductoDto } from './dto/create-producto.dto';
import { UpdateProductoDto } from './dto/update-producto.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Estado } from 'generated/prisma/enums';
import { Prisma } from '../../generated/prisma/client';

@Injectable()
export class ProductoService {
  constructor(private prisma: PrismaService) {}

  async create(createProductoDto: CreateProductoDto) {
    const { costoNeto, utilidad, descuentoContado } = createProductoDto;

    const precioLista = costoNeto + (costoNeto * utilidad) / 100;

    const precioContado = precioLista - (precioLista * descuentoContado) / 100;

    try {
      return await this.prisma.producto.create({
        data: {
          ...createProductoDto,
          precioLista,
          precioContado,
          stockTotal: 0,
          estado: 'DISPONIBLE',
          fechaHoraUltimoMovimientoStock: new Date(),
          fechaHoraUltimaSincronizacionStock: new Date(),
        },
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new BadRequestException('Ya existe un producto con ese nombre');
      }
      throw error;
    }
  }

  findAll() {
    return this.prisma.producto.findMany();
  }

  findOne(id: number) {
    return this.prisma.producto.findUnique({ where: { id } });
  }

  async update(id: number, updateProductoDto: UpdateProductoDto) {
    try {
      return await this.prisma.producto.update({
        where: { id },
        data: updateProductoDto,
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new BadRequestException('Ya existe un producto con ese nombre');
      }
      throw error;
    }
  }

  remove(id: number) {
    return this.prisma.producto.update({
      where: { id },
      data: { archivado: true },
    });
  }

  @Cron(CronExpression.EVERY_DAY_AT_3AM)
  async actualizarEstadosPorInactividad() {
    const stockProductos = await this.prisma.producto.findMany({
      where: {
        stockTotal: 0,
      },
    });

    const ahora = new Date();

    for (const producto of stockProductos) {
      const diferenciaMs =
        ahora.getTime() - producto.fechaHoraUltimoMovimientoStock.getTime();
      const diasTranscurridos = Math.floor(
        diferenciaMs / (1000 * 60 * 60 * 24),
      );

      let nuevoEstado: Estado = 'DISPONIBLE';

      if (diasTranscurridos >= 15) {
        nuevoEstado = 'INACTIVO';
      } else if (diasTranscurridos >= 7) {
        nuevoEstado = 'ACTIVO';
      }

      await this.prisma.producto.update({
        where: { id: producto.id },
        data: { estado: nuevoEstado },
      });
    }
  }

  reactivar(id: number) {
    return this.prisma.producto.update({
      where: { id },
      data: { archivado: false },
    });
  }
}
