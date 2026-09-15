import { Injectable, BadRequestException } from '@nestjs/common';
import { CreateCategoriaNivel1Dto } from './dto/create-categoria-nivel1.dto';
import { UpdateCategoriaNivel1Dto } from './dto/update-categoria-nivel1.dto';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '../../generated/prisma/client';

@Injectable()
export class CategoriaNivel1Service {
  constructor(private prisma: PrismaService) {}

  async create(createCategoriaNivel1Dto: CreateCategoriaNivel1Dto) {
    try {
      return await this.prisma.categoriaNivel1.create({
        data: createCategoriaNivel1Dto,
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new BadRequestException('Ya existe una categoria con ese nombre');
      }
      throw error;
    }
  }

  findAllCategorias() {
    return this.prisma.categoriaNivel1.findMany({
      include: { categoriasNivel2: true },
    });
  }

  findAll() {
    return this.prisma.categoriaNivel1.findMany();
  }

  findOne(id: number) {
    return this.prisma.categoriaNivel1.findUnique({ where: { id } });
  }

  async update(id: number, updateCategoriaNivel1Dto: UpdateCategoriaNivel1Dto) {
    try {
      return await this.prisma.categoriaNivel1.update({
        where: { id },
        data: updateCategoriaNivel1Dto,
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new BadRequestException('Ya existe una categoria con ese nombre');
      }
      throw error;
    }
  }

  remove(id: number) {
    return this.prisma.categoriaNivel1.update({
      where: { id },
      data: { archivado: true },
    });
  }

  reactivar(id: number) {
    return this.prisma.categoriaNivel1.update({
      where: { id },
      data: { archivado: false },
    });
  }
}
