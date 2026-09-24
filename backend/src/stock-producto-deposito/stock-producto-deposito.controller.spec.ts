import { Test, TestingModule } from '@nestjs/testing';
import { StockProductoDepositoController } from './stock-producto-deposito.controller';
import { StockProductoDepositoService } from './stock-producto-deposito.service';

describe('StockProductoDepositoController', () => {
  let controller: StockProductoDepositoController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StockProductoDepositoController],
      providers: [{ provide: StockProductoDepositoService, useValue: {} }],
    }).compile();

    controller = module.get<StockProductoDepositoController>(StockProductoDepositoController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
