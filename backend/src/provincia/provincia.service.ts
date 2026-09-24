import { Injectable, BadRequestException } from '@nestjs/common';
import { CreateProvinciaDto } from './dto/create-provincia.dto';
import { UpdateProvinciaDto } from './dto/update-provincia.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from '../../generated/prisma/client';

@Injectable()
export class ProvinciaService {
  constructor(private prisma: PrismaService) {}

  async create(createProvinciaDto: CreateProvinciaDto) {
    try {
      return await this.prisma.provincia.create({ data: createProvinciaDto });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new BadRequestException('Ya existe una provincia con ese nombre');
      }
      throw error;
    }
  }

  findAll() {
    return this.prisma.provincia.findMany();
  }

  findOne(id: number) {
    return this.prisma.provincia.findUnique({ where: { id } });
  }

  async update(id: number, updateProvinciaDto: UpdateProvinciaDto) {
    try {
      return await this.prisma.provincia.update({
        where: { id },
        data: updateProvinciaDto,
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new BadRequestException('Ya existe una provincia con ese nombre');
      }
      throw error;
    }
  }

  remove(id: number) {
    return this.prisma.provincia.update({
      where: { id },
      data: { archivado: true },
    });
  }

  reactivar(id: number) {
    return this.prisma.provincia.update({
      where: { id },
      data: { archivado: false },
    });
  }
}
