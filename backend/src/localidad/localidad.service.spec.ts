import { Test, TestingModule } from '@nestjs/testing';
import { LocalidadService } from './localidad.service';

describe('LocalidadService', () => {
  let service: LocalidadService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [{ provide: LocalidadService, useFactory: () => new LocalidadService({} as never) }],
    }).compile();

    service = module.get<LocalidadService>(LocalidadService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
