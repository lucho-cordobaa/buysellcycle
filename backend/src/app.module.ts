import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MarcaModule } from './marca/marca.module';
import { PrismaModule } from './prisma/prisma.module';
import { CategoriaNivel1Module } from './categoria-nivel1/categoria-nivel1.module';
import { ProveedorModule } from './proveedor/proveedor.module';
import { SucursalModule } from './sucursal/sucursal.module';
import { LocalidadModule } from './localidad/localidad.module';
import { ProvinciaModule } from './provincia/provincia.module';
import { CategoriaNivel2Module } from './categoria-nivel2/categoria-nivel2.module';
import { ClienteModule } from './cliente/cliente.module';
import { UsuarioModule } from './usuario/usuario.module';
import { DepositoModule } from './deposito/deposito.module';
import { ProductoModule } from './producto/producto.module';
import { StockProductoDepositoModule } from './stock-producto-deposito/stock-producto-deposito.module';
import { PresupuestoModule } from './presupuesto/presupuesto.module';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    MarcaModule,
    PrismaModule,
    CategoriaNivel1Module,
    ProveedorModule,
    SucursalModule,
    LocalidadModule,
    ProvinciaModule,
    CategoriaNivel2Module,
    ClienteModule,
    UsuarioModule,
    DepositoModule,
    ProductoModule,
    StockProductoDepositoModule,
    PresupuestoModule,
    ScheduleModule.forRoot(),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
