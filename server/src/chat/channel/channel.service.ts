import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Channel } from '../../entities/channel.entity';
import { CreateChannelDto } from './dto/create-channel.dto';

@Injectable()
export class ChannelService {
  constructor(
    @InjectRepository(Channel) private channelRepositery: Repository<Channel>,
  ) {}

  async createChannel(channelDto: CreateChannelDto): Promise<Channel> {
    let newChannel: Channel = new Channel();

    newChannel.members = [];
    newChannel.password = '';
    newChannel.createdDate = new Date();
    //const channel = this.channelRepositery.create(channelDto);
    return await this.channelRepositery.save(newChannel);
  }

  async getAllChannels(): Promise<Channel[]> {
    let data: Channel[];
    try {
      data = await this.channelRepositery.find();
    } catch (err) {
      throw err;
    }
    console.log('Returning the data');
    console.log(data);
    return data;
  }
}
