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
import { ProductoService } from './producto.service';
import { CreateProductoDto } from './dto/create-producto.dto';
import { UpdateProductoDto } from './dto/update-producto.dto';

@Controller('producto')
export class ProductoController {
  constructor(private readonly productoService: ProductoService) {}

  @Post()
  async create(@Body() createProductoDto: CreateProductoDto) {
    const productoCreado = await this.productoService.create(createProductoDto);
    return productoCreado;
  }

  @Get()
  findAll() {
    return this.productoService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const producto = await this.productoService.findOne(+id);
    if (!producto) {
      throw new NotFoundException('Producto no encontrado');
    }
    return producto;
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateProductoDto: UpdateProductoDto,
  ) {
    const productoActualizado = await this.productoService.update(
      +id,
      updateProductoDto,
    );
    return productoActualizado;
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const productoEliminado = await this.productoService.remove(+id);
    return productoEliminado;
  }

  @Post('actualizar-estados')
  async actualizarEstados() {
    return this.productoService.actualizarEstadosPorInactividad();
  }

  @Patch(':id/reactivar')
  async reactivar(@Param('id') id: string) {
    const productoReactivado = await this.productoService.reactivar(+id);
    return productoReactivado;
  }
}
