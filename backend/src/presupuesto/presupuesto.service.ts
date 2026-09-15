import { Injectable } from '@nestjs/common';
import { CreatePresupuestoDto } from './dto/create-presupuesto.dto';
import { UpdatePresupuestoDto } from './dto/update-presupuesto.dto';
import { BadRequestException } from '@nestjs/common/exceptions';
import { PrismaService } from '../prisma/prisma.service';
import { Decimal } from '../../generated/prisma/internal/prismaNamespace';

@Injectable()
export class PresupuestoService {
  constructor(private prisma: PrismaService) {}

  async create(createPresupuestoDto: CreatePresupuestoDto) {
    const { clienteId, usuarioId, detalleItems } = createPresupuestoDto;

    const lineas = await Promise.all(
      detalleItems.map(async (item) => {
        const producto = await this.prisma.producto.findUnique({
          where: { id: item.productoId },
        });

        if (!producto) {
          throw new BadRequestException(
            `Producto ${item.productoId} no encontrado`,
          );
        }

        return {
          productoId: item.productoId,
          cantidad: item.cantidad,
          precioUnitario: producto.precioContado,
        };
      }),
    );

    const total = lineas.reduce(
      (acc, item) => acc.add(item.precioUnitario.mul(item.cantidad)),
      new Decimal(0),
    );

    return this.prisma.$transaction(async (tx) => {
      const presupuesto = await tx.presupuesto.create({
        data: {
          clienteId,
          usuarioId,
          total,
          estado: 'PENDIENTE',
        },
      });

      const detalle = await Promise.all(
        lineas.map((item) => {
          return tx.detallePresupuesto.create({
            data: {
              presupuestoId: presupuesto.id,
              productoId: item.productoId,
              cantidad: item.cantidad,
              precioUnitario: item.precioUnitario,
            },
          });
        }),
      );

      return { presupuesto, detalle };
    });
  }

  findAll() {
    return this.prisma.presupuesto.findMany({
      include: {
        detallePresupuesto: true,
        cliente: true,
        usuario: true,
      },
    });
  }

  findOne(id: number) {
    return this.prisma.presupuesto.findUnique({
      include: {
        detallePresupuesto: true,
        cliente: true,
        usuario: true,
      },
      where: { id },
    });
  }

  update(id: number, updatePresupuestoDto: UpdatePresupuestoDto) {
    return this.prisma.presupuesto.update({
      where: { id },
      data: updatePresupuestoDto,
    });
  }

  remove(id: number) {
    return this.prisma.presupuesto.update({
      where: { id },
      data: { archivado: true },
    });
  }

  reactivar(id: number) {
    return this.prisma.presupuesto.update({
      where: { id },
      data: { archivado: false },
    });
  }
}
