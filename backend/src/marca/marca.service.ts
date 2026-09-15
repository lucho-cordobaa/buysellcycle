import { Injectable, BadRequestException } from '@nestjs/common';
import { CreateMarcaDto } from './dto/create-marca.dto';
import { UpdateMarcaDto } from './dto/update-marca.dto';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '../../generated/prisma/client';

@Injectable()
export class MarcaService {
  constructor(private prisma: PrismaService) {}

  async create(createMarcaDto: CreateMarcaDto) {
    try {
      return await this.prisma.marca.create({ data: createMarcaDto });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new BadRequestException('Ya existe una marca con ese nombre');
      }
      throw error;
    }
  }

  findAll() {
    return this.prisma.marca.findMany();
  }

  findOne(id: number) {
    return this.prisma.marca.findUnique({ where: { id } });
  }

  async update(id: number, updateMarcaDto: UpdateMarcaDto) {
    try {
      return await this.prisma.marca.update({
        where: { id },
        data: updateMarcaDto,
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new BadRequestException('Ya existe una marca con ese nombre');
      }
      throw error;
    }
  }

  remove(id: number) {
    return this.prisma.marca.update({
      where: { id },
      data: { archivado: true },
    });
  }

  reactivar(id: number) {
    return this.prisma.marca.update({
      where: { id },
      data: { archivado: false },
    });
  }
}
