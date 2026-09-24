import { Injectable, BadRequestException } from '@nestjs/common';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from '../../generated/prisma/client';

@Injectable()
export class UsuarioService {
  constructor(private prisma: PrismaService) {}

  async create(createUsuarioDto: CreateUsuarioDto) {
    try {
      return await this.prisma.usuario.create({ data: createUsuarioDto });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        const target = error.meta?.target as string[] | undefined;
        if (target?.includes('dni')) {
          throw new BadRequestException('Ya existe un usuario con ese DNI');
        }
        if (target?.includes('nombreUsuario')) {
          throw new BadRequestException('Ese nombre de usuario ya está en uso');
        }
        throw new BadRequestException('Dato duplicado');
      }
      throw error;
    }
  }

  findAll() {
    return this.prisma.usuario.findMany();
  }

  findOne(id: number) {
    return this.prisma.usuario.findUnique({ where: { id } });
  }

  async update(id: number, updateUsuarioDto: UpdateUsuarioDto) {
    try {
      return await this.prisma.usuario.update({
        where: { id },
        data: updateUsuarioDto,
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        const target = error.meta?.target as string[] | undefined;
        if (target?.includes('dni')) {
          throw new BadRequestException('Ya existe un usuario con ese DNI');
        }
        if (target?.includes('nombreUsuario')) {
          throw new BadRequestException('Ese nombre de usuario ya está en uso');
        }
        throw new BadRequestException('Dato duplicado');
      }
      throw error;
    }
  }

  remove(id: number) {
    return this.prisma.usuario.update({
      where: { id },
      data: { archivado: true },
    });
  }

  reactivar(id: number) {
    return this.prisma.usuario.update({
      where: { id },
      data: { archivado: false },
    });
  }
}
