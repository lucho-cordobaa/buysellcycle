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
import { CategoriaNivel2Service } from './categoria-nivel2.service';
import { CreateCategoriaNivel2Dto } from './dto/create-categoria-nivel2.dto';
import { UpdateCategoriaNivel2Dto } from './dto/update-categoria-nivel2.dto';

@Controller('categoria-nivel2')
export class CategoriaNivel2Controller {
  constructor(
    private readonly categoriaNivel2Service: CategoriaNivel2Service,
  ) {}

  @Post()
  async create(@Body() createCategoriaNivel2Dto: CreateCategoriaNivel2Dto) {
    const categoria2Creada = await this.categoriaNivel2Service.create(
      createCategoriaNivel2Dto,
    );
    return categoria2Creada;
  }

  @Get()
  findAll() {
    return this.categoriaNivel2Service.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const categoria2 = await this.categoriaNivel2Service.findOne(+id);
    if (!categoria2) {
      throw new NotFoundException('Categoria no encontrada');
    }
    return categoria2;
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateCategoriaNivel2Dto: UpdateCategoriaNivel2Dto,
  ) {
    const categoria2Actualizada = await this.categoriaNivel2Service.update(
      +id,
      updateCategoriaNivel2Dto,
    );
    return categoria2Actualizada;
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const categoria2Eliminada = await this.categoriaNivel2Service.remove(+id);
    return categoria2Eliminada;
  }

  @Patch(':id/reactivar')
  async reactivar(@Param('id') id: string) {
    const categoriaReactivada =
      await this.categoriaNivel2Service.reactivar(+id);
    return categoriaReactivada;
  }
}
