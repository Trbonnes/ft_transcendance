import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DirectChannel } from '../../entities/direct-channel.entity'
import { DirectMessage } from '../../entities/direct-message.entity'

@Injectable()
export class DirectChannelService {

  constructor(
    @InjectRepository(DirectChannel) private channelRepositery: Repository<DirectChannel>,
  ) { }

  getAllChannels(userId: string): Promise<DirectChannel[]> {
    return this.channelRepositery.find({
      where: [{ user1: userId }, { user2: userId }],
      order: { lastMessageUpdate: "DESC" },
      relations: ["user1", "user2"]
    })
  }

  getOneByUsers(user1Id: string, user2Id: string) {
    return this.channelRepositery.find({ where: [{ user1: user1Id, user2: user2Id }, { user1: user2Id, user2: user1Id }] })
  }

  saveOne(user1: string, user2: string) {
    let data = new DirectChannel()
    data.user1Id = user1;
    data.user2Id = user2;
    return this.channelRepositery.save(data)
  }

  async getMessages(user1: string, user2: string) {
    let data = await this.channelRepositery.findOne(
      {
        where: [
          { user1Id: user1, user2Id: user2 },
          { user1Id: user2, user2Id: user1 }
        ],
        relations: ["messages"]
      })
    if (data)
      return data.messages
    return []
  }

}
