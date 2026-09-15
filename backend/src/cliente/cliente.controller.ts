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
import { ClienteService } from './cliente.service';
import { CreateClienteDto } from './dto/create-cliente.dto';
import { UpdateClienteDto } from './dto/update-cliente.dto';

@Controller('cliente')
export class ClienteController {
  constructor(private readonly clienteService: ClienteService) {}

  @Post()
  async create(@Body() createClienteDto: CreateClienteDto) {
    const clienteCreado = await this.clienteService.create(createClienteDto);
    return clienteCreado;
  }

  @Get()
  findAll() {
    return this.clienteService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const cliente = await this.clienteService.findOne(+id);
    if (!cliente) {
      throw new NotFoundException('Cliente no encontrado');
    }
    return cliente;
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateClienteDto: UpdateClienteDto,
  ) {
    const clienteActualizado = await this.clienteService.update(
      +id,
      updateClienteDto,
    );
    return clienteActualizado;
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const clienteEliminado = await this.clienteService.remove(+id);
    return clienteEliminado;
  }

  @Patch(':id/reactivar')
  async reactivar(@Param('id') id: string) {
    const clienteReactivado = await this.clienteService.reactivar(+id);
    return clienteReactivado;
  }
}
