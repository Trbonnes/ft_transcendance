import { Module } from '@nestjs/common';
import { ChannelService } from './channel.service';
import { ChannelController } from './channel.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Channel } from '../../entities/channel.entity';
import { ChannelMessage } from 'src/entities/channel-message.entity';
import { ChannelMessageService } from './channel-message/channel-message.service';
import { UsersModule } from 'src/users/users.module';
import { ChannelMembershipService } from './channel-membership/channel-membership.service';
import { ChannelMembership } from '../../entities/channel-membership.entity'

@Module({
  imports: [
    TypeOrmModule.forFeature([Channel]),
    TypeOrmModule.forFeature([ChannelMessage]),
    TypeOrmModule.forFeature([ChannelMembership]),
    UsersModule,
  ],
  providers: [ChannelService, ChannelMessageService, ChannelMembershipService],
  controllers: [ChannelController],
  exports: [ChannelService, ChannelMessageService, ChannelMembershipService],
})
export class ChannelModule { }
