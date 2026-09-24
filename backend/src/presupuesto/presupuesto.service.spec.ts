import { Test, TestingModule } from '@nestjs/testing';
import { PresupuestoService } from './presupuesto.service';

describe('PresupuestoService', () => {
  let service: PresupuestoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [{ provide: PresupuestoService, useFactory: () => new PresupuestoService({} as never) }],
    }).compile();

    service = module.get<PresupuestoService>(PresupuestoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
