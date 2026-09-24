import { Test, TestingModule } from '@nestjs/testing';
import { ProveedorService } from './proveedor.service';

describe('ProveedorService', () => {
  let service: ProveedorService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [{ provide: ProveedorService, useFactory: () => new ProveedorService({} as never) }],
    }).compile();

    service = module.get<ProveedorService>(ProveedorService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
