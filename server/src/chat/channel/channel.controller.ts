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
  HttpCode,
} from '@nestjs/common';
import { ChannelService } from './channel.service';
import { ChannelMembershipService } from './channel-membership/channel-membership.service';
import { ChannelMembership } from '../../entities/channel-membership.entity';
import { Channel } from '../../entities/channel.entity';
import { ChannelTimeout } from '../../entities/channel-timeout.entity'
import { CreateChannelDto } from './dto/create-channel.dto';
import { TimeoutDto } from './dto/timeout.dto'
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { IsChannelAdminGuard } from './is-channel-admin.guard'
import { IsChannelMemberGuard } from './is-channel-member.guard'
import { ChatGateway } from '../app.chatgateway'
import { UsersService } from 'src/users/users.service';
import { User } from 'src/entities/user.entity';
import * as bcrypt from "bcrypt"

@Controller('channel')
export class ChannelController {
  constructor(
    private readonly channelService: ChannelService,
    private readonly membershipService: ChannelMembershipService,
    private readonly chatGateway: ChatGateway,
    private readonly usersService: UsersService
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
      return data
    } catch (error) {
      return new HttpException(
        'Cannot retrieve members',
        HttpStatus.NOT_FOUND,
      );
    }
  }

  @Get(':channelId/convoMembers')
  @UseGuards(JwtAuthGuard, IsChannelMemberGuard)
  async getConvoMembers(@Param('channelId') channelId: string) {
    try {
      let data = await this.channelService.getConvoMembers(channelId)
      return data
    } catch (error) {
      return new HttpException(
        'Cannot retrieve members',
        HttpStatus.NOT_FOUND,
      );
    }
  }

  @Post(':channelId/members/:userId/makeAdmin')
  @UseGuards(JwtAuthGuard, IsChannelAdminGuard)
  async updateMember(@Param('channelId') channelId: string,
    @Param('userId') userId: string,
    @Req() req: any) {
    try {
      return this.membershipService.update(channelId, userId, true)
    } catch (error) {
      return new HttpException("Cannot update user", HttpStatus.BAD_REQUEST)
    }
  }

  @Post(':channelId/members/:userId/unmakeAdmin')
  @UseGuards(JwtAuthGuard, IsChannelAdminGuard)
  async unmakeAdmin(@Param('channelId') channelId: string,
    @Param('userId') userId: string,
    @Req() req: any) {
    try {
      const channel = await this.channelService.getById(channelId)
      if (channel.owner.id === userId)
        return new HttpException("Cannot remove owner as admin", HttpStatus.FORBIDDEN)
      return this.membershipService.update(channelId, userId, false)
    } catch (error) {
      return new HttpException("Cannot update user", HttpStatus.BAD_REQUEST)
    }
  }

  @Post(':channelId/members/:userId/makeOwner')
  @UseGuards(JwtAuthGuard, IsChannelAdminGuard)
  async makeOwner(@Param('channelId') channelId: string,
    @Param('userId') userId: string,
    @Req() req: any) {
    try {
      let channel = await this.channelService.getById(channelId)
      if (channel.owner.id !== req.user.id)
        return new HttpException("You are not the owner", HttpStatus.FORBIDDEN)
      if (req.user.id === userId)
        return new HttpException("User is already the owner", HttpStatus.FORBIDDEN)
      const mem = await this.membershipService.getOne(channelId, userId)
      if (!mem)
        return new HttpException("User is not a member", HttpStatus.BAD_REQUEST)
      if (!mem.isAdmin)
        return new HttpException("User is not an admin", HttpStatus.BAD_REQUEST)
      delete channel.owner
      channel.ownerId = userId
      this.channelService.saveChannel(channel)
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
      if (payload.newPassword != "")
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
  async deleteChannel(@Req() req: any, @Param('channelId') channelId: string) {
    try {
      const channel = await this.channelService.getById(channelId)
      if (req.user.id !== channel.ownerId)
        return new HttpException("Only the owner can delete the channel", HttpStatus.UNAUTHORIZED)
      let data = await this.channelService.deleteChannel(channelId)
      this.chatGateway.destroyedChannel(channelId)
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
      if (dto.duration < 0)
        return new HttpException("Request malformed", HttpStatus.BAD_REQUEST);
      let membership = await this.membershipService.getOne(channelId, dto.userId)
      if (!membership)
        return new HttpException("User is not in channel", HttpStatus.BAD_REQUEST);
      const channel = await this.channelService.getById(channelId)
      if (channel.ownerId === dto.userId)
        return new HttpException("Cannot ban owner", HttpStatus.FORBIDDEN);
      if (membership.timeout && membership.timeout.end < new Date())
        await this.membershipService.unbanOne(membership.id)
      await this.membershipService.banOne(membership.id, dto.duration)
      let ret = await this.chatGateway.banUser(channelId, dto.userId)
      return ret
    }
    catch (error: any) {
      return new HttpException("Cannot ban user", HttpStatus.BAD_REQUEST);
    }
  }

  @Post(':channelId/unban')
  @UseGuards(JwtAuthGuard, IsChannelAdminGuard)
  async unbanUser(@Param('channelId') channelId: string, @Req() req, @Body() dto: { userId: string }) {
    try {
      let membership = await this.membershipService.getOne(channelId, dto.userId)
      if (!membership)
        return new HttpException("User is not in channel", HttpStatus.BAD_REQUEST);
      if (!membership.timeout)
        return new HttpException("User is not banned", HttpStatus.BAD_REQUEST);
      this.membershipService.unbanOne(membership.id)
      return { status: 201, message: 'User ubanned' };
    }
    catch (error: any) {
      return new HttpException("Cannot ban user", HttpStatus.BAD_REQUEST);
    }
  }

  @Post(':channelId/join')
  @UseGuards(JwtAuthGuard)
  async joinChannel(@Req() req, @Param('channelId') channelId: string, @Body() dto: { password: string }) {
    try {
      if (await this.membershipService.isMember(channelId, req.user.id)) {
        if (await this.membershipService.isBanned(channelId, req.user.id))
          return new HttpException("You are banned from this channel", HttpStatus.FORBIDDEN);
        return { status: 201, message: 'Joined channel' }
      }
      const channel = await this.channelService.getById(channelId); // the true includes the password
      const user : User = await this.usersService.findOneById(req.user.id)
      if (channel.isPublic === false && user.role != "admin" && user.role != "superAdmin") {
        if (!dto.password)
          return new HttpException('Password needed', HttpStatus.UNAUTHORIZED);
        // TODO set password to sha256
        // dto.password = await bcrypt.hash(dto.password, 10);
        const isPasswordMatching = await bcrypt.compare(dto.password, channel.password);
        if (!isPasswordMatching)
          return new HttpException('Invalid password', HttpStatus.BAD_REQUEST);
      }
      this.membershipService.create(channelId, req.user.id)
    } catch (error) {
      return new HttpException("Can't join channel", HttpStatus.BAD_REQUEST);
    }
    return { status: 201, message: 'Joined channel' };
  }

  @Delete(':channelId/leave')
  @UseGuards(JwtAuthGuard, IsChannelMemberGuard)
  async leaveChannel(@Req() req, @Param('channelId') channelId: string) {
    try {
      const mem = await this.membershipService.getOne(channelId, req.user.id)
      const channel = await this.channelService.getById(channelId)
      if (channel.ownerId === req.user.id)
        return new HttpException("You must transfer ownership before leaving", HttpStatus.FORBIDDEN);
      this.membershipService.delete(channelId, req.user.id)
    } catch (error) {
      return new HttpException("Can't leave channel", HttpStatus.BAD_REQUEST);
    }
    return { status: 201, message: 'Channel leaved' };
  }
}
