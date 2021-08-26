import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Channel } from '../../entities/channel.entity';
import { User } from '../../entities/user.entity';
import { CreateChannelDto } from './dto/create-channel.dto';
import { getManager } from 'typeorm';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class ChannelService {
  constructor(
    @InjectRepository(Channel) private channelRepositery: Repository<Channel>,
    private readonly userService: UsersService,
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

    const data = await this.channelRepositery.save(newChannel);
    delete data.password;
    return data;
  }

  async joinChannel(channelId: string, userId: string) {
    let user = await this.userService.findOneById(userId);
    let channel = await this.channelRepositery.findOne(channelId, {
      relations: ['members'],
    });
    channel.members.push(user);
    this.channelRepositery.save(channel);
  }

  async findUserInChannel(channelId: string, userId: string) {
    let data = await this.channelRepositery
      .createQueryBuilder('channel')
      .innerJoinAndSelect('channel.members', 'member')
      .where('channel.id = :channelId AND member.id = :userId', {
        channelId,
        userId,
      })
      .getOne();
    if (data) delete data.password;
    return data;
  }

  getById(channelId: string) {
    return this.channelRepositery.findOne({ id: channelId });
  }

  async getAllChannels(): Promise<Channel[]> {
    let data: Channel[];
    try {
      data = await this.channelRepositery.find();
      for (let index = 0; index < data.length; index++) {
        const c = data[index];
        delete c.password;
      }
    } catch (err) {
      throw err;
    }
    return data;
  }

  async searchByName(name: string): Promise<any> {
    const manager = getManager();
    const res = await manager.query(
      'select *, levenshtein(($1), "channel".name) as leven from "channel" order by leven limit 10',
      [name],
    );
    for (let index = 0; index < res.length; index++) {
      const element = res[index];
      delete element.password;
    }
    return res;
  }
}
