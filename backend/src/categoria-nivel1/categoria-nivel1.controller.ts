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
import { CategoriaNivel1Service } from './categoria-nivel1.service';
import { CreateCategoriaNivel1Dto } from './dto/create-categoria-nivel1.dto';
import { UpdateCategoriaNivel1Dto } from './dto/update-categoria-nivel1.dto';

@Controller('categoria-nivel1')
export class CategoriaNivel1Controller {
  constructor(
    private readonly categoriaNivel1Service: CategoriaNivel1Service,
  ) {}

  @Post()
  async create(@Body() createCategoriaNivel1Dto: CreateCategoriaNivel1Dto) {
    const categoriaCreado = await this.categoriaNivel1Service.create(
      createCategoriaNivel1Dto,
    );
    return categoriaCreado;
  }

  @Get()
  findAll() {
    return this.categoriaNivel1Service.findAll();
  }

  @Get('categorias')
  findAllCategorias() {
    return this.categoriaNivel1Service.findAllCategorias();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const categoria = await this.categoriaNivel1Service.findOne(+id);
    if (!categoria) {
      throw new NotFoundException('Categoria no encontrada');
    }
    return categoria;
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateCategoriaNivel1Dto: UpdateCategoriaNivel1Dto,
  ) {
    const categoriaActualizada = await this.categoriaNivel1Service.update(
      +id,
      updateCategoriaNivel1Dto,
    );
    return categoriaActualizada;
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const categoriaEliminada = await this.categoriaNivel1Service.remove(+id);
    return categoriaEliminada;
  }

  @Patch(':id/reactivar')
  async reactivar(@Param('id') id: string) {
    const categoriaReactivada =
      await this.categoriaNivel1Service.reactivar(+id);
    return categoriaReactivada;
  }
}
