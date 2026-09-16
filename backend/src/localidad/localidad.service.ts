import { Injectable, BadRequestException } from '@nestjs/common';
import { CreateLocalidadDto } from './dto/create-localidad.dto';
import { UpdateLocalidadDto } from './dto/update-localidad.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from '../../generated/prisma/client';

@Injectable()
export class LocalidadService {
  constructor(private prisma: PrismaService) {}

  create(createLocalidadDto: CreateLocalidadDto) {
    try {
      return this.prisma.localidad.create({ data: createLocalidadDto });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new BadRequestException('Ya existe una localidad con ese nombre');
      }
      throw error;
    }
  }

  findAll() {
    return this.prisma.localidad.findMany();
  }

  findOne(id: number) {
    return this.prisma.localidad.findUnique({ where: { id } });
  }

  update(id: number, updateLocalidadDto: UpdateLocalidadDto) {
    try {
      return this.prisma.localidad.update({
        where: { id },
        data: updateLocalidadDto,
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new BadRequestException('Ya existe una localidad con ese nombre');
      }
      throw error;
    }
  }

  remove(id: number) {
    return this.prisma.localidad.update({
      where: { id },
      data: { archivado: true },
    });
  }

  reactivar(id: number) {
    return this.prisma.localidad.update({
      where: { id },
      data: { archivado: false },
    });
  }
}
