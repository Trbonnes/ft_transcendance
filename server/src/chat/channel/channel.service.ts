import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Channel } from '../../entities/channel.entity';
import { User } from '../../entities/user.entity';
import { CreateChannelDto } from './dto/create-channel.dto';
import { getManager } from 'typeorm';
import { UsersService } from 'src/users/users.service';
import { ChannelMessageService } from './channel-message/channel-message.service'
import { ChannelMembership } from '../../entities/channel-membership.entity'
import * as bcrypt from "bcrypt"

@Injectable()
export class ChannelService {
  constructor(
    @InjectRepository(Channel) private channelRepositery: Repository<Channel>,
    private readonly userService: UsersService,
    private readonly channelMessageService: ChannelMessageService,
  ) { }

  async createChannel(
    channelDto: CreateChannelDto,
    userid: string,
  ): Promise<Channel> {
    let newChannel: Channel = new Channel();

    newChannel.isPublic = channelDto.isPublic;
    newChannel.name = channelDto.channelName;
    newChannel.owner = <any>{ id: userid };
    newChannel.password = await bcrypt.hash(channelDto.channelPassword, 10);
    // TODO should we only update password if the channel is private ?

    const data = await this.channelRepositery.save(newChannel);

    delete data.password;
    return data;
  }

  async saveChannel(channel: Channel) {
    return this.channelRepositery.save(channel)
  }

  async deleteChannel(channelId: string) {
    return this.channelRepositery.delete(channelId)
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
    return this.channelRepositery
      .createQueryBuilder('channel')
      .addSelect('channel.password')
      .leftJoinAndSelect('channel.owner', 'user')
      .where('channel.id = :channelId', { channelId: channelId }).getOneOrFail()
    // return this.channelRepositery.findOneOrFail(channelId, { relations: ["owner"], selectj})
  }

  getMessageHistory(channelId: string) {
    return this.channelMessageService.getByChannelId(channelId) // TODO maybe it's best practice to move this logic into the controller ?
  }

  async getMembers(channelId: string) {
    const data = await this.channelRepositery.findOne(channelId, { relations: ["members"] }) //TODO try catch block
    if (data)
      return data
    return []
  }

  async getConvoMembers(channelId: string) {
    let ids = await this.channelMessageService.getUsersInConvo(channelId)
    // console.log("Here are the ids")
    let users: User[] = []
    if (ids.length > 0)
      users = await this.userService.getUsersByIds(ids)
    return users
  }

  async getAllChannels(): Promise<Channel[]> {
    let data: any[];
    try {
      data = await this.channelRepositery.find({ relations: ["owner"] })
      for (let index = 0; index < data.length; index++) {
        const c = data[index];
        c.owner = c.owner.id
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
