import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ChannelMessage } from 'src/entities/channel-message.entity';
import { User } from 'src/entities/user.entity';
import { Channel } from 'src/entities/channel.entity';

@Injectable()
export class ChannelMessageService {
  constructor(
    @InjectRepository(ChannelMessage)
    private channelMessageRepositery: Repository<ChannelMessage>,
  ) { }

  async createOne(senderId: string, channelId: string, content: string) {
    let msg = new ChannelMessage();
    console.log(senderId, channelId, content, 'bande de fils de putes');
    msg.senderId = senderId; // TO DO fix inneficient ffs
    msg.channelId = channelId;
    msg.content = content;
    return this.channelMessageRepositery.save(msg);
  }

  async getByChannelId(channelId: string) {
    let builder = this.channelMessageRepositery.createQueryBuilder('channel-message')
      .where("channel-message.channelId = :channelId", { channelId })
      .orderBy('channel-message.createdDate')
    return builder.getMany()
  }
}
