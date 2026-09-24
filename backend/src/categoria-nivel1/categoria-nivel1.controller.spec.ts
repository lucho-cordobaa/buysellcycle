import { Test, TestingModule } from '@nestjs/testing';
import { CategoriaNivel1Controller } from './categoria-nivel1.controller';
import { CategoriaNivel1Service } from './categoria-nivel1.service';

describe('CategoriaNivel1Controller', () => {
  let controller: CategoriaNivel1Controller;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CategoriaNivel1Controller],
      providers: [{ provide: CategoriaNivel1Service, useValue: {} }],
    }).compile();

    controller = module.get<CategoriaNivel1Controller>(CategoriaNivel1Controller);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
