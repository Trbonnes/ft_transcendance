import { Test, TestingModule } from '@nestjs/testing';
import { DirectChannelController } from './direct-channel.controller';

describe('DirectChannelController', () => {
  let controller: DirectChannelController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DirectChannelController],
    }).compile();

    controller = module.get<DirectChannelController>(DirectChannelController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
