import { Injectable } from '@nestjs/common';
import { CreateLocalidadDto } from './dto/create-localidad.dto';
import { UpdateLocalidadDto } from './dto/update-localidad.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class LocalidadService {
  constructor(private prisma: PrismaService) {}

  create(createLocalidadDto: CreateLocalidadDto) {
    return this.prisma.localidad.create({ data: createLocalidadDto });
  }

  findAll() {
    return this.prisma.localidad.findMany();
  }

  findOne(id: number) {
    return this.prisma.localidad.findUnique({ where: { id } });
  }

  update(id: number, updateLocalidadDto: UpdateLocalidadDto) {
    return this.prisma.localidad.update({
      where: { id },
      data: updateLocalidadDto,
    });
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
