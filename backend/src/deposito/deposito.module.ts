import { Module } from '@nestjs/common';
import { DepositoService } from './deposito.service';
import { DepositoController } from './deposito.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  controllers: [DepositoController],
  providers: [DepositoService],
  imports: [PrismaModule],
})
export class DepositoModule {}
