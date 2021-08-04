import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { ChannelService } from './channel.service';
import { Channel } from '../../entities/channel.entity';
import { CreateChannelDto } from './dto/create-channel.dto';

@Controller('channel')
export class ChannelController {
  constructor(private readonly channelService: ChannelService) {}

  // Returns all channel for an user, can only be used by admin and the user who has the channels
  @Get('all')
  all() {
    return this.channelService.getAllChannels();
  }

  // Returns a specific channe information
  @Get(':id')
  getOne() {
    return {};
  }

  @Post('create')
  createChannel(@Body() channelDto: CreateChannelDto) {
    return this.channelService.createChannel(channelDto);
  }
}
