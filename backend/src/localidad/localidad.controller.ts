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
import { LocalidadService } from './localidad.service';
import { CreateLocalidadDto } from './dto/create-localidad.dto';
import { UpdateLocalidadDto } from './dto/update-localidad.dto';

@Controller('localidad')
export class LocalidadController {
  constructor(private readonly localidadService: LocalidadService) {}

  @Post()
  async create(@Body() createLocalidadDto: CreateLocalidadDto) {
    const localidadCreada =
      await this.localidadService.create(createLocalidadDto);
    return localidadCreada;
  }

  @Get()
  findAll() {
    return this.localidadService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const localidad = await this.localidadService.findOne(+id);
    if (!localidad) {
      throw new NotFoundException('Localidad no encontrada');
    }
    return localidad;
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateLocalidadDto: UpdateLocalidadDto,
  ) {
    const localidadActualizada = await this.localidadService.update(
      +id,
      updateLocalidadDto,
    );
    return localidadActualizada;
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const localidadEliminada = await this.localidadService.remove(+id);
    return localidadEliminada;
  }

  @Patch(':id/reactivar')
  async reactivar(@Param('id') id: string) {
    const localidadReactivada = await this.localidadService.reactivar(+id);
    return localidadReactivada;
  }
}
