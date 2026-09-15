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
import { MarcaService } from './marca.service';
import { CreateMarcaDto } from './dto/create-marca.dto';
import { UpdateMarcaDto } from './dto/update-marca.dto';

@Controller('marca')
export class MarcaController {
  constructor(private readonly marcaService: MarcaService) {}

  @Post()
  async create(@Body() createMarcaDto: CreateMarcaDto) {
    const marcaCreada = await this.marcaService.create(createMarcaDto);
    return marcaCreada;
  }

  @Get()
  findAll() {
    return this.marcaService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const marca = await this.marcaService.findOne(+id);
    if (!marca) {
      throw new NotFoundException('Marca no encontrada');
    }
    return marca;
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateMarcaDto: UpdateMarcaDto,
  ) {
    const marcaActualizada = await this.marcaService.update(
      +id,
      updateMarcaDto,
    );
    return marcaActualizada;
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const marcaEliminada = await this.marcaService.remove(+id);
    return marcaEliminada;
  }

  @Patch(':id/reactivar')
  async reactivar(@Param('id') id: string) {
    const marcaReactivada = await this.marcaService.reactivar(+id);
    return marcaReactivada;
  }
}
