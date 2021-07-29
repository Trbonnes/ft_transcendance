import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Channel } from '../../entities/channel.entity';

@Injectable()
export class ChannelService {
  constructor(
    @InjectRepository(Channel) private channelRepositery: Repository<Channel>,
  ) {}

  async getAllChannels() {
    let data: Channel[];
    try {
      data = await this.channelRepositery.find();
    } catch (err) {
      throw err;
    }
    return data;
  }
}
