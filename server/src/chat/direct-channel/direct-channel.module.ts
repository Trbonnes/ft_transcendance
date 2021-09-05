import { Module } from '@nestjs/common';
import { DirectChannelService } from './direct-channel.service';
import { DirectChannelController } from './direct-channel.controller';
import { DirectChannel } from '../../entities/direct-channel.entity'
import { TypeOrmModule } from '@nestjs/typeorm';
import { DirectMessage } from '../../entities/direct-message.entity'

@Module({
  imports: [
    TypeOrmModule.forFeature([DirectChannel]),
    TypeOrmModule.forFeature([DirectMessage]),
  ],
  providers: [DirectChannelService],
  exports: [DirectChannelService],
  controllers: [DirectChannelController]
})
export class DirectChannelModule { }
