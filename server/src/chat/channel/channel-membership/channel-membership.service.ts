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
    const data = await this.membershipRepo.find({ where: { channelId: cId }, relations: ["user"] }) // TODO refactor names
    if (data)
      return data
    return []
  }

  async getOne(channelId: string, userId: string) {
    return this.membershipRepo.findOneOrFail({ channelId: channelId, userId: userId })
  }

  async update(channelId: string, userId: string, isAdmin: boolean, isBanned: boolean) {
    let mem = new ChannelMembership()
    mem.channelId = channelId
    mem.userId = userId
    mem.isAdmin = isAdmin
    mem.isBanned = isBanned
    return this.membershipRepo.save(mem)
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
