import { Injectable } from '@nestjs/common';
import { CreateDepositoDto } from './dto/create-deposito.dto';
import { UpdateDepositoDto } from './dto/update-deposito.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class DepositoService {
  constructor(private prisma: PrismaService) {}

  create(createDepositoDto: CreateDepositoDto) {
    return this.prisma.deposito.create({ data: createDepositoDto });
  }

  findAll() {
    return this.prisma.deposito.findMany();
  }

  findOne(id: number) {
    return this.prisma.deposito.findUnique({ where: { id } });
  }

  update(id: number, updateDepositoDto: UpdateDepositoDto) {
    return this.prisma.deposito.update({
      where: { id },
      data: updateDepositoDto,
    });
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
