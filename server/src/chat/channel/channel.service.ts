import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Channel } from '../../entities/channel.entity';
import { User } from '../../entities/user.entity';
import { CreateChannelDto } from './dto/create-channel.dto';
import { getManager } from 'typeorm';

@Injectable()
export class ChannelService {
  constructor(
    @InjectRepository(Channel) private channelRepositery: Repository<Channel>,
  ) {}

  async createChannel(
    channelDto: CreateChannelDto,
    userid: string,
  ): Promise<Channel> {
    let newChannel: Channel = new Channel();

    newChannel.isPublic = channelDto.isPublic;
    newChannel.name = channelDto.channelName;
    newChannel.owner = <any>{ id: userid };
    // TODO should we only update password if the channel is private ?
    newChannel.password = channelDto.channelPassword;

    return this.channelRepositery.save(newChannel);
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

  async searchByName(name: string): Promise<any> {
    const manager = getManager();
    const res = manager.query(
      'select *, levenshtein(($1), "channel".name) as leven from "channel" order by leven limit 10',
      [name],
    );
    return res;
  }
}
