import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  NotFoundException,
} from '@nestjs/common';
import { DepositoService } from './deposito.service';
import { CreateDepositoDto } from './dto/create-deposito.dto';
import { UpdateDepositoDto } from './dto/update-deposito.dto';

@Controller('deposito')
export class DepositoController {
  constructor(private readonly depositoService: DepositoService) {}

  @Post()
  async create(@Body() createDepositoDto: CreateDepositoDto) {
    const depositoCreado = await this.depositoService.create(createDepositoDto);
    return depositoCreado;
  }

  @Get()
  findAll() {
    return this.depositoService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const deposito = await this.depositoService.findOne(+id);
    if (!deposito) {
      throw new NotFoundException('Deposito no encontrado');
    }
    return deposito;
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateDepositoDto: UpdateDepositoDto,
  ) {
    const depositoActualizado = await this.depositoService.update(
      +id,
      updateDepositoDto,
    );
    return depositoActualizado;
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const depositoEliminado = await this.depositoService.remove(+id);
    return depositoEliminado;
  }

  @Patch(':id/reactivar')
  async reactivar(@Param('id') id: string) {
    const depositoReactivado = await this.depositoService.reactivar(+id);
    return depositoReactivado;
  }
}
