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
import { SucursalService } from './sucursal.service';
import { CreateSucursalDto } from './dto/create-sucursal.dto';
import { UpdateSucursalDto } from './dto/update-sucursal.dto';

@Controller('sucursal')
export class SucursalController {
  constructor(private readonly sucursalService: SucursalService) {}

  @Post()
  async create(@Body() createSucursalDto: CreateSucursalDto) {
    const sucursalCreada = await this.sucursalService.create(createSucursalDto);
    return sucursalCreada;
  }

  @Get()
  findAll() {
    return this.sucursalService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const sucursal = await this.sucursalService.findOne(+id);
    if (!sucursal) {
      throw new NotFoundException('Sucursal no encontrada');
    }
    return sucursal;
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateSucursalDto: UpdateSucursalDto,
  ) {
    const sucursalActualizada = await this.sucursalService.update(
      +id,
      updateSucursalDto,
    );
    return sucursalActualizada;
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const sucursalEliminada = await this.sucursalService.remove(+id);
    return sucursalEliminada;
  }

  @Patch(':id/reactivar')
  async reactivar(@Param('id') id: string) {
    const sucursalReactivada = await this.sucursalService.reactivar(+id);
    return sucursalReactivada;
  }
}
