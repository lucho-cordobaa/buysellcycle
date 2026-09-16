import { Injectable, BadRequestException } from '@nestjs/common';
import { CreateClienteDto } from './dto/create-cliente.dto';
import { UpdateClienteDto } from './dto/update-cliente.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from '../../generated/prisma/client';

@Injectable()
export class ClienteService {
  constructor(private prisma: PrismaService) {}

  async create(createClienteDto: CreateClienteDto) {
    try {
      return await this.prisma.cliente.create({ data: createClienteDto });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        const target = error.meta?.target as string[] | undefined;
        if (target?.includes('dni')) {
          throw new BadRequestException('Ya existe un cliente con ese DNI');
        }
        if (target?.includes('email')) {
          throw new BadRequestException('Ya existe un cliente con ese email');
        }
        throw new BadRequestException('Dato duplicado');
      }
      throw error;
    }
  }

  findAll() {
    return this.prisma.cliente.findMany();
  }

  findOne(id: number) {
    return this.prisma.cliente.findUnique({ where: { id } });
  }

  update(id: number, updateClienteDto: UpdateClienteDto) {
    try {
      return this.prisma.cliente.update({
        where: { id },
        data: updateClienteDto,
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        const target = error.meta?.target as string[] | undefined;
        if (target?.includes('dni')) {
          throw new BadRequestException('Ya existe un cliente con ese DNI');
        }
        if (target?.includes('email')) {
          throw new BadRequestException('Ya existe un cliente con ese email');
        }
        throw new BadRequestException('Dato duplicado');
      }
      throw error;
    }
  }

  remove(id: number) {
    return this.prisma.cliente.update({
      where: { id },
      data: { archivado: true },
    });
  }

  reactivar(id: number) {
    return this.prisma.cliente.update({
      where: { id },
      data: { archivado: false },
    });
  }
}
