import { Test, TestingModule } from '@nestjs/testing';
import { CategoriaNivel1Service } from './categoria-nivel1.service';

describe('CategoriaNivel1Service', () => {
  let service: CategoriaNivel1Service;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CategoriaNivel1Service],
    }).compile();

    service = module.get<CategoriaNivel1Service>(CategoriaNivel1Service);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
