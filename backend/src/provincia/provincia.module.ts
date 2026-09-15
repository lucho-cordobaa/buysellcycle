import { Module } from '@nestjs/common';
import { ProvinciaService } from './provincia.service';
import { ProvinciaController } from './provincia.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  controllers: [ProvinciaController],
  providers: [ProvinciaService],
  imports: [PrismaModule],
})
export class ProvinciaModule {}
