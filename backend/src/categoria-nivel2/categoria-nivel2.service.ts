import { Injectable, BadRequestException } from '@nestjs/common';
import { CreateCategoriaNivel2Dto } from './dto/create-categoria-nivel2.dto';
import { UpdateCategoriaNivel2Dto } from './dto/update-categoria-nivel2.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from '../../generated/prisma/client';

@Injectable()
export class CategoriaNivel2Service {
  constructor(private prisma: PrismaService) {}

  async create(createCategoriaNivel2Dto: CreateCategoriaNivel2Dto) {
    try {
      return await this.prisma.categoriaNivel2.create({
        data: createCategoriaNivel2Dto,
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

  findAll() {
    return this.prisma.categoriaNivel2.findMany();
  }

  findOne(id: number) {
    return this.prisma.categoriaNivel2.findUnique({ where: { id } });
  }

  async update(id: number, updateCategoriaNivel2Dto: UpdateCategoriaNivel2Dto) {
    try {
      return await this.prisma.categoriaNivel2.update({
        where: { id },
        data: updateCategoriaNivel2Dto,
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
    return this.prisma.categoriaNivel2.update({
      where: { id },
      data: { archivado: true },
    });
  }

  reactivar(id: number) {
    return this.prisma.categoriaNivel2.update({
      where: { id },
      data: { archivado: false },
    });
  }
}
