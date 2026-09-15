import { Module } from '@nestjs/common';
import { MarcaService } from './marca.service';
import { MarcaController } from './marca.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  controllers: [MarcaController],
  providers: [MarcaService],
  imports: [PrismaModule],
})
export class MarcaModule {}
