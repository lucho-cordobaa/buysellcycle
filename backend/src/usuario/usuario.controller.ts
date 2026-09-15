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
import { UsuarioService } from './usuario.service';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';

@Controller('usuario')
export class UsuarioController {
  constructor(private readonly usuarioService: UsuarioService) {}

  @Post()
  async create(@Body() createUsuarioDto: CreateUsuarioDto) {
    const usuarioCreado = await this.usuarioService.create(createUsuarioDto);
    return usuarioCreado;
  }

  @Get()
  findAll() {
    return this.usuarioService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const usuario = await this.usuarioService.findOne(+id);
    if (!usuario) {
      throw new NotFoundException('Usuario no encontrado');
    }
    return usuario;
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateUsuarioDto: UpdateUsuarioDto,
  ) {
    const usuarioActualizado = await this.usuarioService.update(
      +id,
      updateUsuarioDto,
    );
    return usuarioActualizado;
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const usuarioEliminado = await this.usuarioService.remove(+id);
    return usuarioEliminado;
  }

  @Patch(':id/reactivar')
  async reactivar(@Param('id') id: string) {
    const usuarioReactivado = await this.usuarioService.reactivar(+id);
    return usuarioReactivado;
  }
}
