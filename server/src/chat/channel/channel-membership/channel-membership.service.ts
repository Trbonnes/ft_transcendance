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

  getMembers(cId: string) {
    return this.membershipRepo.findOne(cId, { relations: ["user"] })
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
