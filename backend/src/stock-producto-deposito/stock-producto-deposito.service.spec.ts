import { Test, TestingModule } from '@nestjs/testing';
import { StockProductoDepositoService } from './stock-producto-deposito.service';

describe('StockProductoDepositoService', () => {
  let service: StockProductoDepositoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [StockProductoDepositoService],
    }).compile();

    service = module.get<StockProductoDepositoService>(StockProductoDepositoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
