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
import { PresupuestoService } from './presupuesto.service';
import { CreatePresupuestoDto } from './dto/create-presupuesto.dto';
import { UpdatePresupuestoDto } from './dto/update-presupuesto.dto';

@Controller('presupuesto')
export class PresupuestoController {
  constructor(private readonly presupuestoService: PresupuestoService) {}

  @Post()
  async create(@Body() createPresupuestoDto: CreatePresupuestoDto) {
    const presupuestoCreado =
      await this.presupuestoService.create(createPresupuestoDto);
    return presupuestoCreado;
  }

  @Get()
  findAll() {
    return this.presupuestoService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const presupuesto = await this.presupuestoService.findOne(+id);
    if (!presupuesto) {
      throw new NotFoundException('Presupuesto no encontrado');
    }
    return presupuesto;
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updatePresupuestoDto: UpdatePresupuestoDto,
  ) {
    const presupuestoActualizado = await this.presupuestoService.update(
      +id,
      updatePresupuestoDto,
    );
    return presupuestoActualizado;
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const presupuestoEliminado = await this.presupuestoService.remove(+id);
    return presupuestoEliminado;
  }

  @Patch(':id/reactivar')
  async reactivar(@Param('id') id: string) {
    const presupuestoReactivado = await this.presupuestoService.reactivar(+id);
    return presupuestoReactivado;
  }
}
