import { Test, TestingModule } from '@nestjs/testing';
import { ChannelMessageService } from './channel-message.service';

describe('ChannelMessageService', () => {
  let service: ChannelMessageService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ChannelMessageService],
    }).compile();

    service = module.get<ChannelMessageService>(ChannelMessageService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
