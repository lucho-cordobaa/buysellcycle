import { Injectable } from '@nestjs/common';
import { CreateProvinciaDto } from './dto/create-provincia.dto';
import { UpdateProvinciaDto } from './dto/update-provincia.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ProvinciaService {
  constructor(private prisma: PrismaService) {}

  create(createProvinciaDto: CreateProvinciaDto) {
    return this.prisma.provincia.create({ data: createProvinciaDto });
  }

  findAll() {
    return this.prisma.provincia.findMany();
  }

  findOne(id: number) {
    return this.prisma.provincia.findUnique({ where: { id } });
  }

  update(id: number, updateProvinciaDto: UpdateProvinciaDto) {
    return this.prisma.provincia.update({
      where: { id },
      data: updateProvinciaDto,
    });
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
