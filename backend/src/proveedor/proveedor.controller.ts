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
import { ProveedorService } from './proveedor.service';
import { CreateProveedorDto } from './dto/create-proveedor.dto';
import { UpdateProveedorDto } from './dto/update-proveedor.dto';

@Controller('proveedor')
export class ProveedorController {
  constructor(private readonly proveedorService: ProveedorService) {}

  @Post()
  async create(@Body() createProveedorDto: CreateProveedorDto) {
    const proveedorCreado =
      await this.proveedorService.create(createProveedorDto);
    return proveedorCreado;
  }

  @Get()
  findAll() {
    return this.proveedorService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const proveedor = await this.proveedorService.findOne(+id);
    if (!proveedor) {
      throw new NotFoundException('Proveedor no encontrado');
    }
    return proveedor;
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateProveedorDto: UpdateProveedorDto,
  ) {
    const proveedorActualizado = await this.proveedorService.update(
      +id,
      updateProveedorDto,
    );
    return proveedorActualizado;
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const proveedorEliminado = await this.proveedorService.remove(+id);
    return proveedorEliminado;
  }

  @Patch(':id/reactivar')
  async reactivar(@Param('id') id: string) {
    const proveedorReactivado = await this.proveedorService.reactivar(+id);
    return proveedorReactivado;
  }
}
