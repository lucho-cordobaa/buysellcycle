import { Module } from '@nestjs/common';
import { CategoriaNivel1Service } from './categoria-nivel1.service';
import { CategoriaNivel1Controller } from './categoria-nivel1.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  controllers: [CategoriaNivel1Controller],
  providers: [CategoriaNivel1Service],
  imports: [PrismaModule],
})
export class CategoriaNivel1Module {}
