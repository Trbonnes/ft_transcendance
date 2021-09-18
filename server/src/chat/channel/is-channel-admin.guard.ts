import { Inject, CanActivate, ExecutionContext, Injectable, Request } from '@nestjs/common';
import { Observable } from 'rxjs';
import { ChannelMembershipService } from './channel-membership/channel-membership.service'
import { ChannelMembership } from '../../entities/channel-membership.entity'

@Injectable()
export class IsChannelAdminGuard implements CanActivate {
  constructor(private readonly memService: ChannelMembershipService) { }
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
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
      if (data.isAdmin == false || isBanned == true)
        return false
      return true
    })
      .catch(() => {
        return false
      })
    // console.log("Guard code")
    // console.log(req.url)
  }
}
