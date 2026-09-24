import { Test, TestingModule } from '@nestjs/testing';
import { CategoriaNivel2Controller } from './categoria-nivel2.controller';
import { CategoriaNivel2Service } from './categoria-nivel2.service';

describe('CategoriaNivel2Controller', () => {
  let controller: CategoriaNivel2Controller;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CategoriaNivel2Controller],
      providers: [{ provide: CategoriaNivel2Service, useValue: {} }],
    }).compile();

    controller = module.get<CategoriaNivel2Controller>(CategoriaNivel2Controller);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
