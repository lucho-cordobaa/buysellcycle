import { Injectable, BadRequestException } from '@nestjs/common';
import { CreateProveedorDto } from './dto/create-proveedor.dto';
import { UpdateProveedorDto } from './dto/update-proveedor.dto';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '../../generated/prisma/client';

@Injectable()
export class ProveedorService {
  constructor(private prisma: PrismaService) {}

  create(createProveedorDto: CreateProveedorDto) {
    try {
      return this.prisma.proveedor.create({ data: createProveedorDto });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new BadRequestException('Ya existe un proveedor con ese CUIT');
      }
      throw error;
    }
  }

  findAll() {
    return this.prisma.proveedor.findMany();
  }

  findOne(id: number) {
    return this.prisma.proveedor.findUnique({ where: { id } });
  }

  update(id: number, updateProveedorDto: UpdateProveedorDto) {
    try {
      return this.prisma.proveedor.update({
        where: { id },
        data: updateProveedorDto,
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new BadRequestException('Ya existe un proveedor con ese CUIT');
      }
      throw error;
    }
  }

  remove(id: number) {
    return this.prisma.proveedor.update({
      where: { id },
      data: { archivado: true },
    });
  }

  reactivar(id: number) {
    return this.prisma.proveedor.update({
      where: { id },
      data: { archivado: false },
    });
  }
}
