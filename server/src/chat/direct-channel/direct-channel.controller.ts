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
import { DirectChannel } from '../../entities/direct-channel.entity'
import { DirectMessage } from '../../entities/direct-message.entity'
import { User } from '../../entities/user.entity'
import { DirectChannelService } from './direct-channel.service'
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

interface DirectChannelDto {
  user: User;
  messages: DirectMessage[];
}

@Controller('direct-channel')
export class DirectChannelController {

  constructor(
    private readonly channelService: DirectChannelService,
  ) { }

  @Get('all')
  @UseGuards(JwtAuthGuard)
  async all(
    @Req() req: any
  ) {
    try {
      let channels = await this.channelService.getAllChannels(req.user.id)
      let dto: DirectChannelDto[] = []
      for (let i = 0; i < channels.length; i++) {
        const c = channels[i];
        let tmp: DirectChannelDto = { user: null, messages: [] }
        if (c.user1Id == req.user.id)
          tmp.user = c.user2
        else
          tmp.user = c.user1
        tmp.messages = c.messages
        dto.push(tmp)
      }
      console.log(dto)
      return dto
    } catch (error: any) {
      console.log(error)
      return new HttpException("Cannot get channel list", HttpStatus.BAD_REQUEST)
    }
  }

  @Post(':userId')
  @UseGuards(JwtAuthGuard)
  async joinDirectChannel(@Req() req, @Param('userId') userId: string) { // only one user id, the other one is in the JWT
    if (userId == "")
      return new HttpException("Id cannot be empty", HttpStatus.BAD_REQUEST)
    // TODO check if blocked ?
    try {
      let channel = await this.channelService.getOneByUsers(req.user.id, userId)
      console.log("Here's the found channel")
      console.log(channel)
      let data: DirectChannel
      if (!channel)
        data = await this.channelService.saveOne(req.user.id, userId)
      return { status: 201, message: "Channel joined" }
    } catch (error: any) {
      return new HttpException("Cannot join direct channel", HttpStatus.BAD_REQUEST)
    }
  }

  @Get(':userId/history')
  @UseGuards(JwtAuthGuard)
  async getHistory(@Req() req, @Param('userId') userId: string) { // only one user id, the other one is in the JWT
    try {
      let data = await this.channelService.getMessages(req.user.id, userId)
      return data
    } catch (error) {
      return new HttpException("Cannot retrieve messages", HttpStatus.BAD_REQUEST)
    }
  }
}
