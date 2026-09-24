import { Injectable, BadRequestException } from '@nestjs/common';
import { CreateClienteDto } from './dto/create-cliente.dto';
import { UpdateClienteDto } from './dto/update-cliente.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from '../../generated/prisma/client';
import { validarLocalidadDeProvincia } from '../common/validar-localidad-provincia';

@Injectable()
export class ClienteService {
  constructor(private prisma: PrismaService) {}

  async create(createClienteDto: CreateClienteDto) {
    await validarLocalidadDeProvincia(
      this.prisma,
      createClienteDto.provinciaId,
      createClienteDto.localidadId,
    );
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

  async update(id: number, updateClienteDto: UpdateClienteDto) {
    if (
      updateClienteDto.provinciaId !== undefined ||
      updateClienteDto.localidadId !== undefined
    ) {
      const actual = await this.prisma.cliente.findUnique({
        where: { id },
        select: { provinciaId: true, localidadId: true },
      });
      if (actual) {
        await validarLocalidadDeProvincia(
          this.prisma,
          updateClienteDto.provinciaId ?? actual.provinciaId,
          updateClienteDto.localidadId ?? actual.localidadId,
        );
      }
    }
    try {
      return await this.prisma.cliente.update({
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
