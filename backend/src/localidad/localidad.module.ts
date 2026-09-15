import { Module } from '@nestjs/common';
import { LocalidadService } from './localidad.service';
import { LocalidadController } from './localidad.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  controllers: [LocalidadController],
  providers: [LocalidadService],
  imports: [PrismaModule],
})
export class LocalidadModule {}
