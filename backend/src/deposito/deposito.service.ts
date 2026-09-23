import { Injectable, BadRequestException } from '@nestjs/common';
import { CreateDepositoDto } from './dto/create-deposito.dto';
import { UpdateDepositoDto } from './dto/update-deposito.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from '../../generated/prisma/client';

@Injectable()
export class DepositoService {
  constructor(private prisma: PrismaService) {}

  async create(createDepositoDto: CreateDepositoDto) {
    try {
      const total = await this.prisma.deposito.count();
      const codigo = `DEP-${String(total + 1).padStart(2, '0')}`;
      return await this.prisma.deposito.create({
        data: {
          ...createDepositoDto,
          codigo,
        },
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new BadRequestException('Ya existe un depósito con ese código');
      }
      throw error;
    }
  }

  findAll() {
    return this.prisma.deposito.findMany();
  }

  findOne(id: number) {
    return this.prisma.deposito.findUnique({ where: { id } });
  }

  update(id: number, updateDepositoDto: UpdateDepositoDto) {
    try {
      return this.prisma.deposito.update({
        where: { id },
        data: updateDepositoDto,
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new BadRequestException('Ya existe un depósito con ese código');
      }
      throw error;
    }
  }

  remove(id: number) {
    return this.prisma.deposito.update({
      where: { id },
      data: { archivado: true },
    });
  }

  reactivar(id: number) {
    return this.prisma.deposito.update({
      where: { id },
      data: { archivado: false },
    });
  }
}
