import { PartialType } from '@nestjs/mapped-types';
import { CreateStockProductoDepositoDto } from './create-stock-producto-deposito.dto';

export class UpdateStockProductoDepositoDto extends PartialType(CreateStockProductoDepositoDto) {}
