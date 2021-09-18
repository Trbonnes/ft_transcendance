import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ChannelMembership } from '../../../entities/channel-membership.entity'
import { ChannelTimeout } from '../../../entities/channel-timeout.entity'

@Injectable()
export class ChannelMembershipService {

  constructor(
    @InjectRepository(ChannelMembership) private membershipRepo: Repository<ChannelMembership>,
    @InjectRepository(ChannelTimeout) private timeoutRepo: Repository<ChannelTimeout>
  ) { }

  async isMember(cId: string, uId: string) {
    const data = await this.membershipRepo.findOne({ userId: uId, channelId: cId })
    if (data)
      return true
    return false
  }

  async isBanned(cId: string, uId: string) {
    const data = await this.membershipRepo.findOne({ userId: uId, channelId: cId })
    console.log(data)
    if (data && data.timeout)
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

  async update(channelId: string, userId: string, isAdmin: boolean) {
    let mem = await this.getOne(channelId, userId)
    mem.isAdmin = isAdmin
    return this.membershipRepo.save(mem)
  }

  async create(channelId: string, userId: string, isAdmin = false) {
    let mem = new ChannelMembership()
    mem.userId = userId
    mem.channelId = channelId
    mem.isAdmin = isAdmin
    this.membershipRepo.save(mem)
  }

  async banOne(membershipId: string, start: number, end: number) {
    console.log(start, end)
    let timeout = new ChannelTimeout()
    timeout.start = new Date(start)
    if (end === -1)
      timeout.end = new Date(8640000000000000)// max timestamp
    else
      timeout.end = new Date(end * 60000)
    timeout.membershipId = membershipId
    return this.timeoutRepo.save(timeout)
  }

}
