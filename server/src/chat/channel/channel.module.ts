import { Module, forwardRef } from '@nestjs/common';
import { ChannelService } from './channel.service';
import { ChannelController } from './channel.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Channel } from '../../entities/channel.entity';
import { ChannelMessage } from 'src/entities/channel-message.entity';
import { ChannelTimeout } from 'src/entities/channel-timeout.entity';
import { ChannelMessageService } from './channel-message/channel-message.service';
import { UsersModule } from 'src/users/users.module';
import { ChannelMembershipService } from './channel-membership/channel-membership.service';
import { ChannelMembership } from '../../entities/channel-membership.entity'
import { IsChannelAdminGuard } from './is-channel-admin.guard'
import { IsChannelMemberGuard } from './is-channel-member.guard'
import { ChatGateway } from '../app.chatgateway'
import { ChatModule } from '../chat.module'

@Module({
  imports: [
    TypeOrmModule.forFeature([Channel, ChannelMessage, ChannelMembership, ChannelTimeout]),
    UsersModule,
    forwardRef(() => ChatModule)
  ],
  providers: [IsChannelMemberGuard, IsChannelAdminGuard, ChannelService, ChannelMessageService, ChannelMembershipService],
  controllers: [ChannelController],
  exports: [ChannelService, ChannelMessageService, ChannelMembershipService],
})
export class ChannelModule { }
