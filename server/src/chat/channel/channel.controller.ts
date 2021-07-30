import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { ChannelService } from './channel.service';
import { Channel } from '../../entities/channel.entity';
import { CreateChannelDto } from './dto/create-channel.dto';

@Controller('channel')
export class ChannelController {
  constructor(private readonly channelService: ChannelService) {}

  @Get()
  all() {
    let data: any = this.channelService.getAllChannels();
    console.log(typeof data);
    return data;
  }

  // Returns a specific channe information
  @Get(':id')
  getOne() {
    return {};
  }

  // Returns all channel for an user, can only be used by admin and the user who has the channels
  @Get('user/:id')
  getAllForUser() {
    return {};
  }

  // Returns the result for a specific page of results
  @Get('public/:page')
  getAllPublicPage() {
    return {};
  }

  @Post('create')
  createChannel(@Body() channelDto: CreateChannelDto) {
    return "This creates a channel let's go !!!!!";
  }
}
