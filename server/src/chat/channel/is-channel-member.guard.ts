import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { ChannelMembershipService } from './channel-membership/channel-membership.service'
import { ChannelMembership } from '../../entities/channel-membership.entity'

@Injectable()
export class IsChannelMemberGuard implements CanActivate {
  constructor(private readonly memService: ChannelMembershipService) { }
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    console.log("Checking if user is a member of channel")
    const req: any = context.switchToHttp().getRequest<Request>()
    if (!req.user)
      return false
    let channelId = ""
    if (req.params)
      channelId = req.params.channelId
    else
      return false
    return this.memService.getOne(channelId, req.user.id).then(async (data: ChannelMembership) => {
      if (!data)
        return false
      let isBanned = await this.memService.isBanned(channelId, req.user.id)
      console.log(isBanned)
      if (isBanned)
        return false
      return true
    })
      .catch(() => {
        return false
      })
  }
}
