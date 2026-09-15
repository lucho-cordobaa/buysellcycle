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
import { StockProductoDepositoService } from './stock-producto-deposito.service';
import { CreateStockProductoDepositoDto } from './dto/create-stock-producto-deposito.dto';
import { UpdateStockProductoDepositoDto } from './dto/update-stock-producto-deposito.dto';
import { IngresoStockDto } from './dto/ingreso-stock.dto';
import { TransferenciaStockDto } from './dto/transferencia-stock.dto';

@Controller('stock-producto-deposito')
export class StockProductoDepositoController {
  constructor(
    private readonly stockProductoDepositoService: StockProductoDepositoService,
  ) {}

  @Post()
  async create(
    @Body() createStockProductoDepositoDto: CreateStockProductoDepositoDto,
  ) {
    const stockProductoDepositoCreado =
      await this.stockProductoDepositoService.create(
        createStockProductoDepositoDto,
      );
    return stockProductoDepositoCreado;
  }

  @Get()
  findAll() {
    return this.stockProductoDepositoService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const stockProductoDeposito =
      await this.stockProductoDepositoService.findOne(+id);
    if (!stockProductoDeposito) {
      throw new NotFoundException(
        'Stock de producto en depósito no encontrado',
      );
    }
    return stockProductoDeposito;
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateStockProductoDepositoDto: UpdateStockProductoDepositoDto,
  ) {
    const stockProductoDepositoActualizado =
      await this.stockProductoDepositoService.update(
        +id,
        updateStockProductoDepositoDto,
      );
    return stockProductoDepositoActualizado;
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const stockProductoDepositoEliminado =
      await this.stockProductoDepositoService.remove(+id);
    return stockProductoDepositoEliminado;
  }

  @Post('ingreso')
  async ingresarStock(@Body() ingresoDto: IngresoStockDto) {
    return this.stockProductoDepositoService.ingresarStock(ingresoDto);
  }

  @Post('egreso')
  async egresarStock(@Body() egresoDto: IngresoStockDto) {
    return this.stockProductoDepositoService.egresarStock(egresoDto);
  }

  @Post('transferencia')
  async transferirStock(@Body() transferenciaDto: TransferenciaStockDto) {
    return this.stockProductoDepositoService.transferirStock(transferenciaDto);
  }

  @Patch(':id/reactivar')
  async reactivar(@Param('id') id: string) {
    const stockReactivado =
      await this.stockProductoDepositoService.reactivar(+id);
    return stockReactivado;
  }
}
