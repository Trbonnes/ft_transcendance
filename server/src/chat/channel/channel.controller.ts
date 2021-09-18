import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  HttpException,
  BadRequestException,
  HttpStatus,
  UseGuards,
  Req,
} from '@nestjs/common';
import { ChannelService } from './channel.service';
import { ChannelMembershipService } from './channel-membership/channel-membership.service';
import { ChannelMembership } from '../../entities/channel-membership.entity';
import { Channel } from '../../entities/channel.entity';
import { ChannelTimeout } from '../../entities/channel-timeout.entity'
import { CreateChannelDto } from './dto/create-channel.dto';
import { JoinChannelDto } from './dto/join-channel.dto';
import { TimeoutDto } from './dto/timeout.dto'
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { IsChannelAdminGuard } from './is-channel-admin.guard'
import { IsChannelMemberGuard } from './is-channel-member.guard'
import { ChatGateway } from '../app.chatgateway'

@Controller('channel')
export class ChannelController {
  constructor(
    private readonly channelService: ChannelService,
    private readonly membershipService: ChannelMembershipService,
    private readonly chatGateway: ChatGateway
  ) { }

  // Returns all channel for an user, can only be used by admin and the user who has the channels
  @Get('all')
  @UseGuards(JwtAuthGuard)
  all() {
    return this.channelService.getAllChannels();
  }

  @Get(':channelId')
  @UseGuards(JwtAuthGuard)
  async getOne(@Param('channelId') channelId: string) {
    try {
      let data = await this.channelService.getById(channelId)
      console.log(data)
      return data
    } catch (error) {
      return new HttpException(
        'Can\'t fetch channel',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Get('search/:name')
  @UseGuards(JwtAuthGuard)
  async searchChannelByName(@Param('name') name: string) {
    return await this.channelService.searchByName(name);
  }

  @Get(':channelId/history')
  @UseGuards(JwtAuthGuard, IsChannelMemberGuard)
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
  @UseGuards(JwtAuthGuard, IsChannelMemberGuard)
  async getMembers(@Param('channelId') channelId: string) {
    try {
      let data = await this.membershipService.getMembers(channelId)
      console.log(data)
      return data
    } catch (error) {
      return new HttpException(
        'Cannot retrieve members',
        HttpStatus.NOT_FOUND,
      );
    }
  }

  @Post(':channelId/members/:userId/update')
  @UseGuards(JwtAuthGuard, IsChannelAdminGuard)
  async updateMember(@Param('channelId') channelId: string,
    @Param('userId') userId: string,
    @Req() req: any,
    @Body() payload: { isAdmin: boolean; isBanned: boolean }) {
    try {
      const mem = await this.membershipService.getOne(channelId, req.user.id)
      if (!mem)
        return new HttpException("You're not a member of the channel", HttpStatus.FORBIDDEN)
      if (mem.isAdmin === false) {
        return new HttpException("You're not an administrator !", HttpStatus.FORBIDDEN)
      }
      (await this.membershipService.update(channelId, userId, payload.isAdmin))

    } catch (error) {
      return new HttpException("Cannot update user", HttpStatus.BAD_REQUEST)
    }
  }

  @Post(':channelId/update')
  @UseGuards(JwtAuthGuard, IsChannelAdminGuard)
  async updateChannel(@Param('channelId') channelId: string,
    @Req() req: any,
    @Body() payload: { channelName: string; isPrivate: boolean; newPassword: string }) {
    try {
      let channel = await this.channelService.getById(channelId)
      if (channel.isPublic === true && payload.isPrivate && payload.newPassword === "")
        return new HttpException("Password cannot be empty", HttpStatus.BAD_REQUEST)
      if (payload.channelName === "")
        return new HttpException("Channel name cannot be empty", HttpStatus.BAD_REQUEST)
      channel.isPublic = !payload.isPrivate
      channel.name = payload.channelName
      channel.password = payload.newPassword // TODO set password to sha
      let data = await this.channelService.saveChannel(channel)
      delete data.password
      return data
    } catch (error) {
      return new BadRequestException()
    }
  }

  @Delete(':channelId/delete')
  @UseGuards(JwtAuthGuard, IsChannelAdminGuard)
  async deleteChannel(@Param('channelId') channelId: string) {
    try {
      let data = await this.channelService.deleteChannel(channelId)
      return { status: 201 } //TODO maybe change code ? 
    } catch (error) {
      return new HttpException("Cannot delete channel", HttpStatus.BAD_REQUEST)
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

  @Post(':channelId/ban')
  @UseGuards(JwtAuthGuard, IsChannelAdminGuard)
  async banUser(@Param('channelId') channelId: string, @Req() req, @Body() dto: TimeoutDto) {
    try {
      if (dto.end >= dto.start)
        return new HttpException("Request malformed", HttpStatus.BAD_REQUEST);
      let membership = await this.membershipService.getOne(channelId, dto.userId)
      if (!membership)
        return new HttpException("User is not in channel", HttpStatus.BAD_REQUEST);
      let data = await this.membershipService.banOne(membership.id, dto.start, dto.end)
      let ret = await this.chatGateway.banUser(channelId, dto.userId)
      return data
    }
    catch (error: any) {
      return new HttpException("Can't ban user", HttpStatus.BAD_REQUEST);
    }
  }

  @Post('join')
  @UseGuards(JwtAuthGuard)
  async joinChannel(@Req() req, @Body() dto: JoinChannelDto) {
    try {
      if (await this.membershipService.isMember(dto.channelId, req.user.id))
        return { status: 201, message: 'Joined channel' }
      const channel = await this.channelService.getById(dto.channelId); // the true includes the password
      if (channel.isPublic === false) {
        if (!dto.password)
          return new HttpException('Password needed', HttpStatus.UNAUTHORIZED);
        // TODO set password to sha256
        console.log(dto.password, channel.password);
        if (dto.password != channel.password)
          return new HttpException('Invalid password', HttpStatus.BAD_REQUEST);
      }
      this.membershipService.create(dto.channelId, req.user.id)
    } catch (error) {
      console.log(error)
      return new HttpException("Can't join channel", HttpStatus.BAD_REQUEST);
    }
    return { status: 201, message: 'Joined channel' };
  }
}
