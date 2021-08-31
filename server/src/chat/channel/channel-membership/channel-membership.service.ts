import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ChannelMembership } from '../../../entities/channel-membership.entity'

@Injectable()
export class ChannelMembershipService {

  constructor(
    @InjectRepository(ChannelMembership) private membershipRepo: Repository<ChannelMembership>
  ) { }

  async isMember(cId: string, uId: string) {
    const data = await this.membershipRepo.findOne({ userId: uId, channelId: cId })
    if (data)
      return true
    return false
  }

  async getMembers(cId: string) {
    const data = await this.membershipRepo.find({ where: { channelId: cId }, relations: ["user"] })
    console.log("Here is the data")
    console.log(data)
    if (data)
      return data
    return []
  }

  async create(channelId: string, userId: string, isAdmin = false) {
    let mem = new ChannelMembership()
    mem.userId = userId
    mem.channelId = channelId
    mem.isAdmin = isAdmin
    mem.isBanned = false
    this.membershipRepo.save(mem)
  }

}
