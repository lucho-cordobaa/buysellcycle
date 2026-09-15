import { Module } from '@nestjs/common';
import { CategoriaNivel2Service } from './categoria-nivel2.service';
import { CategoriaNivel2Controller } from './categoria-nivel2.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  controllers: [CategoriaNivel2Controller],
  providers: [CategoriaNivel2Service],
  imports: [PrismaModule],
})
export class CategoriaNivel2Module {}
