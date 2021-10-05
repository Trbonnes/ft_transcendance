import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DirectChannel } from '../../entities/direct-channel.entity'
import { DirectMessage } from '../../entities/direct-message.entity'

@Injectable()
export class DirectChannelService {

  constructor(
    @InjectRepository(DirectChannel) private channelRepositery: Repository<DirectChannel>,
    @InjectRepository(DirectMessage) private messageRepositery: Repository<DirectMessage>,
  ) { }

  getAllChannels(userId: string): Promise<DirectChannel[]> {
    return this.channelRepositery.find({
      where: [{ user1Id: userId }, { user2Id: userId }],
      relations: ["user1", "user2"]
    })
  }

  getOneByUsers(user1Id: string, user2Id: string) {
    return this.channelRepositery.findOne({ where: [{ user1Id: user1Id, user2Id: user2Id }, { user1Id: user2Id, user2Id: user1Id }] })
  }

  getOneByUser(userId: string) {
    return this.channelRepositery.findOne({ where: [{ user1Id: userId }, { user2Id: userId }] })
  }

  saveOne(user1: string, user2: string) {
    let data = new DirectChannel()
    data.user1Id = user1;
    data.user2Id = user2;
    return this.channelRepositery.save(data)
  }

  saveMessage(channelId: string, userId: string, content: string) {
    let message = new DirectMessage()
    message.channelId = channelId
    message.senderId = userId
    message.content = content
    return this.messageRepositery.save(message)
  }

  async getMessages(channelId: string) {
    let data = await this.channelRepositery.findOne(
      {
        where: [
          { id: channelId }
        ],
        relations: ["messages"]
      })
    if (data)
      return data.messages
    return []
  }

}
