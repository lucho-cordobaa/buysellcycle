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
import { ProvinciaService } from './provincia.service';
import { CreateProvinciaDto } from './dto/create-provincia.dto';
import { UpdateProvinciaDto } from './dto/update-provincia.dto';

@Controller('provincia')
export class ProvinciaController {
  constructor(private readonly provinciaService: ProvinciaService) {}

  @Post()
  async create(@Body() createProvinciaDto: CreateProvinciaDto) {
    const provinciaCreada =
      await this.provinciaService.create(createProvinciaDto);
    return provinciaCreada;
  }

  @Get()
  findAll() {
    return this.provinciaService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const provincia = await this.provinciaService.findOne(+id);
    if (!provincia) {
      throw new NotFoundException('Provincia no encontrada');
    }
    return provincia;
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateProvinciaDto: UpdateProvinciaDto,
  ) {
    const provinicaActualizada = await this.provinciaService.update(
      +id,
      updateProvinciaDto,
    );
    return provinicaActualizada;
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const provinciaEliminada = await this.provinciaService.remove(+id);
    return provinciaEliminada;
  }

  @Patch(':id/reactivar')
  async reactivar(@Param('id') id: string) {
    const provinciaReactivada = await this.provinciaService.reactivar(+id);
    return provinciaReactivada;
  }
}
