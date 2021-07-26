import { Test, TestingModule } from '@nestjs/testing';
import { BorderlessGateway } from './app.borderlessgateway';

describe('BorderlessGateway', () => {
  let gateway: BorderlessGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BorderlessGateway],
    }).compile();

    gateway = module.get<BorderlessGateway>(BorderlessGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});
