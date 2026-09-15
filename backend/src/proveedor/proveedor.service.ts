import { Injectable } from '@nestjs/common';
import { CreateProveedorDto } from './dto/create-proveedor.dto';
import { UpdateProveedorDto } from './dto/update-proveedor.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ProveedorService {
  constructor(private prisma: PrismaService) {}

  create(createProveedorDto: CreateProveedorDto) {
    return this.prisma.proveedor.create({ data: createProveedorDto });
  }

  findAll() {
    return this.prisma.proveedor.findMany();
  }

  findOne(id: number) {
    return this.prisma.proveedor.findUnique({ where: { id } });
  }

  update(id: number, updateProveedorDto: UpdateProveedorDto) {
    return this.prisma.proveedor.update({
      where: { id },
      data: updateProveedorDto,
    });
  }

  remove(id: number) {
    return this.prisma.proveedor.update({
      where: { id },
      data: { archivado: true },
    });
  }

  reactivar(id: number) {
    return this.prisma.proveedor.update({
      where: { id },
      data: { archivado: false },
    });
  }
}
