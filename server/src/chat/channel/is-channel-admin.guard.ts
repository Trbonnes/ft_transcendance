import { Inject, CanActivate, ExecutionContext, Injectable, Request } from '@nestjs/common';
import { Observable } from 'rxjs';
import { ChannelMembershipService } from './channel-membership/channel-membership.service'
import { ChannelMembership } from '../../entities/channel-membership.entity'
import { UsersService } from 'src/users/users.service';
import { User } from 'src/entities/user.entity';

@Injectable()
export class IsChannelAdminGuard implements CanActivate {
  constructor(private readonly memService: ChannelMembershipService,
            private readonly usersService: UsersService) { }
  async canActivate(
    context: ExecutionContext,
  ): Promise<any> {
    const req: any = context.switchToHttp().getRequest<Request>()
    if (!req.user)
      return false
    const user = await this.usersService.findOneById(req.user.id)
    let channelId = ""
    if (req.params)
      channelId = req.params.channelId
    else
      return false
    return this.memService.getOne(channelId, req.user.id).then(async (data: ChannelMembership) => {
      if (!data)
        return false
      let isBanned = await this.memService.isBanned(channelId, req.user.id)
      if (user.role === "superAdmin" || user.role === "admin" || data.isAdmin == true)
        return true
      return false
    })
      .catch(() => {
        return false
      })
  }
}
