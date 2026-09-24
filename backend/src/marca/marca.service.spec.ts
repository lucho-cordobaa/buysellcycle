import { Test, TestingModule } from '@nestjs/testing';
import { MarcaService } from './marca.service';

describe('MarcaService', () => {
  let service: MarcaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [{ provide: MarcaService, useFactory: () => new MarcaService({} as never) }],
    }).compile();

    service = module.get<MarcaService>(MarcaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
