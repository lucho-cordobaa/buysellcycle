import { Module } from '@nestjs/common';
import { StockProductoDepositoService } from './stock-producto-deposito.service';
import { StockProductoDepositoController } from './stock-producto-deposito.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  controllers: [StockProductoDepositoController],
  providers: [StockProductoDepositoService],
  imports: [PrismaModule],
})
export class StockProductoDepositoModule {}
