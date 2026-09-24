import { Test, TestingModule } from '@nestjs/testing';
import { CategoriaNivel2Service } from './categoria-nivel2.service';

describe('CategoriaNivel2Service', () => {
  let service: CategoriaNivel2Service;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [{ provide: CategoriaNivel2Service, useFactory: () => new CategoriaNivel2Service({} as never) }],
    }).compile();

    service = module.get<CategoriaNivel2Service>(CategoriaNivel2Service);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
