import { Module } from '@nestjs/common';
import { PresupuestoService } from './presupuesto.service';
import { PresupuestoController } from './presupuesto.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  controllers: [PresupuestoController],
  providers: [PresupuestoService],
  imports: [PrismaModule],
})
export class PresupuestoModule {}
