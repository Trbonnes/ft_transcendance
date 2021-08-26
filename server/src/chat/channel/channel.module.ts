import { Module } from '@nestjs/common';
import { ChannelService } from './channel.service';
import { ChannelController } from './channel.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Channel } from '../../entities/channel.entity';
import { ChannelMessage } from 'src/entities/channel-message.entity';
import { ChannelMessageService } from './channel-message/channel-message.service';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Channel]),
    TypeOrmModule.forFeature([ChannelMessage]),
    UsersModule,
  ],
  providers: [ChannelService, ChannelMessageService],
  controllers: [ChannelController],
  exports: [ChannelService, ChannelMessageService],
})
export class ChannelModule {}
