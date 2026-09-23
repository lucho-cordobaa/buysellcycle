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

  private calcularPrecios(
    costoNeto: number,
    utilidad: number,
    descuentoContado: number,
  ) {
    const precioLista = costoNeto + (costoNeto * utilidad) / 100;
    const precioContado = precioLista - (precioLista * descuentoContado) / 100;
    return { precioLista, precioContado };
  }

  async create(createProductoDto: CreateProductoDto) {
    const { costoNeto, utilidad, descuentoContado } = createProductoDto;

    const { precioLista, precioContado } = this.calcularPrecios(
      costoNeto,
      utilidad,
      descuentoContado,
    );

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
    const productoActual = await this.prisma.producto.findUnique({
      where: { id },
    });

    if (!productoActual) {
      throw new BadRequestException('Producto no encontrado');
    }

    const costoNeto = Number(
      updateProductoDto.costoNeto ?? productoActual.costoNeto,
    );
    const utilidad = Number(
      updateProductoDto.utilidad ?? productoActual.utilidad,
    );
    const descuentoContado = Number(
      updateProductoDto.descuentoContado ?? productoActual.descuentoContado,
    );

    const { precioLista, precioContado } = this.calcularPrecios(
      costoNeto,
      utilidad,
      descuentoContado,
    );

    try {
      return await this.prisma.producto.update({
        where: { id },
        data: {
          ...updateProductoDto,
          precioLista,
          precioContado,
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
