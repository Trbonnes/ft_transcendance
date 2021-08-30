import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  HttpException,
  HttpStatus,
  UseGuards,
  Req,
} from '@nestjs/common';
import { ChannelService } from './channel.service';
import { ChannelMembershipService } from './channel-membership/channel-membership.service';
import { ChannelMembership } from '../../entities/channel-membership.entity';
import { Channel } from '../../entities/channel.entity';
import { CreateChannelDto } from './dto/create-channel.dto';
import { JoinChannelDto } from './dto/join-channel.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('channel')
export class ChannelController {
  constructor(
    private readonly channelService: ChannelService,
    private readonly membershipService: ChannelMembershipService
  ) { }

  // Returns all channel for an user, can only be used by admin and the user who has the channels
  @Get('all')
  all() {
    return this.channelService.getAllChannels();
  }

  @Get('search/:name')
  async searchChannelByName(@Param('name') name: string) {
    return await this.channelService.searchByName(name);
  }

  @Get(':channelId/history')
  @UseGuards(JwtAuthGuard)
  async history(@Param('channelId') channelId: string) {
    try {
      return await this.channelService.getMessageHistory(channelId)
    }
    catch (error: any) {
      return new HttpException(
        'Channel password malformed',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Get(':channelId/members')
  async getMembers(@Param('channelId') channelId: string) {
    try {
      return await this.channelService.getMembers(channelId)
    } catch (error) {
      return new HttpException(
        'Cannot retrieve members',
        HttpStatus.NOT_FOUND,
      );
    }
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
      (await this.membershipService.create(data.id, req.user.id, true)) // Creates a new membership with admin rights
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

  @Post('join')
  @UseGuards(JwtAuthGuard)
  async joinChannel(@Req() req, @Body() dto: JoinChannelDto) {
    try {
      if (await this.membershipService.isMember(dto.channelId, req.user.id))
        return { status: 201, message: 'Joined channel' }
      const channel = await this.channelService.getById(dto.channelId, true); // the true includes the password
      if (channel.isPublic === false) {
        // TODO set password to sha256
        console.log(dto.password, channel.password);
        if (dto.password != channel.password)
          return new HttpException('Invalid password', HttpStatus.BAD_REQUEST);
      }
      this.membershipService.create(dto.channelId, req.user.id)
    } catch (error) {
      return new HttpException("Can't join channel", HttpStatus.BAD_REQUEST);
    }
    return { status: 201, message: 'Joined channel' };
  }
}
