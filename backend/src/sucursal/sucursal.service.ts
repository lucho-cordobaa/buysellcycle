import { Injectable, BadRequestException } from '@nestjs/common';
import { CreateSucursalDto } from './dto/create-sucursal.dto';
import { UpdateSucursalDto } from './dto/update-sucursal.dto';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '../../generated/prisma/client';
import { validarLocalidadDeProvincia } from '../common/validar-localidad-provincia';

@Injectable()
export class SucursalService {
  constructor(private prisma: PrismaService) {}

  async create(createSucursalDto: CreateSucursalDto) {
    await validarLocalidadDeProvincia(
      this.prisma,
      createSucursalDto.provinciaId,
      createSucursalDto.localidadId,
    );
    try {
      return await this.prisma.sucursal.create({ data: createSucursalDto });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new BadRequestException('Ya existe una sucursal con ese nombre');
      }
      throw error;
    }
  }

  findAll() {
    return this.prisma.sucursal.findMany();
  }

  findOne(id: number) {
    return this.prisma.sucursal.findUnique({ where: { id } });
  }

  async update(id: number, updateSucursalDto: UpdateSucursalDto) {
    if (
      updateSucursalDto.provinciaId !== undefined ||
      updateSucursalDto.localidadId !== undefined
    ) {
      const actual = await this.prisma.sucursal.findUnique({
        where: { id },
        select: { provinciaId: true, localidadId: true },
      });
      if (actual) {
        await validarLocalidadDeProvincia(
          this.prisma,
          updateSucursalDto.provinciaId ?? actual.provinciaId,
          updateSucursalDto.localidadId ?? actual.localidadId,
        );
      }
    }
    try {
      return await this.prisma.sucursal.update({
        where: { id },
        data: updateSucursalDto,
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new BadRequestException('Ya existe una sucursal con ese nombre');
      }
      throw error;
    }
  }

  remove(id: number) {
    return this.prisma.sucursal.update({
      where: { id },
      data: { archivado: true },
    });
  }

  reactivar(id: number) {
    return this.prisma.sucursal.update({
      where: { id },
      data: { archivado: false },
    });
  }
}
