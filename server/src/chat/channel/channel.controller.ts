import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  HttpException,
  HttpStatus,
  UseFilters,
  BadRequestException,
  UseGuards,
  Req,
} from '@nestjs/common';
import { ChannelService } from './channel.service';
import { Channel } from '../../entities/channel.entity';
import { CreateChannelDto } from './dto/create-channel.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('channel')
export class ChannelController {
  constructor(private readonly channelService: ChannelService) {}

  // Returns all channel for an user, can only be used by admin and the user who has the channels
  @Get('all')
  all() {
    return this.channelService.getAllChannels();
  }

  // Returns a specific channe information
  // TODO maybe hide password ? You dumbass
  @Get(':id')
  getOne() {
    return {};
  }

  @Get('search/:name')
  async searchChannelByName(@Param('name') name: string) {
    return await this.channelService.searchByName(name);
  }

  @Post('create')
  @UseGuards(JwtAuthGuard)
  async createChannel(@Req() req, @Body() channelDto: CreateChannelDto) {
    if (channelDto.isPublic == false && channelDto.channelPassword == '')
      return new HttpException(
        'Channel password malformed',
        HttpStatus.BAD_REQUEST,
      );
    if (channelDto.channelName == '')
      return new HttpException(
        'Channel name cannot be empty',
        HttpStatus.BAD_REQUEST,
      );

    let data: Channel;
    try {
      data = await this.channelService.createChannel(channelDto, req.user.id);
    } catch (error) {
      if (error && error.code == '23505')
        return new HttpException(
          'Channel already exists',
          HttpStatus.BAD_REQUEST,
        );
      throw error;
    }
    return data;
  }
}
