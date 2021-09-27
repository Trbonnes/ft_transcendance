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
    const data = await this.membershipRepo.findOne({ where: { userId: uId, channelId: cId }, relations: ["timeout"] })
    if (data && data.timeout) {
      if (data.timeout.start.getTime() === data.timeout.end.getTime()) {
        return true;
      }
      if (data.timeout.end < new Date()) {
        this.timeoutRepo.delete(data.timeout.id)
        return false
      }
      return true;
    }
    return false
  }

  async getMembers(cId: string) {
    const data = await this.membershipRepo.find({ where: { channelId: cId }, relations: ["user", "timeout"] }) // TODO refactor names

    if (data)
      return data
    return []
  }

  async getOne(channelId: string, userId: string) {
    return this.membershipRepo.findOneOrFail({ where: { channelId: channelId, userId: userId }, relations: ["user", "timeout"] })
  }

  async update(channelId: string, userId: string, isAdmin: boolean) {
    let mem = await this.getOne(channelId, userId)
    mem.isAdmin = isAdmin
    return this.membershipRepo.save(mem)
  }

  async delete(channelId: string, userId: string) {
    let mem = await this.getOne(channelId, userId)
    return this.membershipRepo.delete(mem.id)
  }

  async create(channelId: string, userId: string, isAdmin = false) {
    let mem = new ChannelMembership()
    mem.userId = userId
    mem.channelId = channelId
    mem.isAdmin = isAdmin
    this.membershipRepo.save(mem)
  }

  async banOne(membershipId: string, duration: number) {
    let timeout = new ChannelTimeout()
    timeout.start = new Date()
    if (duration === 0)
      timeout.end = timeout.start
    else
      timeout.end = new Date(timeout.start.getTime() + duration * 60000)
    timeout.membershipId = membershipId
    return this.timeoutRepo.save(timeout)
  }

  async unbanOne(membershipId: string) {
    console.log("We should unban here")
    return this.timeoutRepo.delete({ membershipId: membershipId })
  }
}
