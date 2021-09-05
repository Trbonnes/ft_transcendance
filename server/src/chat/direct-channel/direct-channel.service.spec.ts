import { Test, TestingModule } from '@nestjs/testing';
import { DirectChannelService } from './direct-channel.service';

describe('DirectChannelService', () => {
  let service: DirectChannelService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DirectChannelService],
    }).compile();

    service = module.get<DirectChannelService>(DirectChannelService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
