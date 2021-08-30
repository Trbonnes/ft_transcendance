import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsResponse,
} from '@nestjs/websockets';
import { EntityNotFoundError } from 'typeorm';
import { UseGuards, Req } from '@nestjs/common';
import { Socket, Server, Namespace } from 'socket.io';
import { Channel } from './../entities/channel.entity';
import { User } from './../entities/user.entity';
import { UsersService } from './../users/users.service';
import { AuthService } from 'src/auth/auth.service';
import { ChannelService } from 'src/chat/channel/channel.service';
import { ChannelMessageService } from 'src/chat/channel/channel-message/channel-message.service';
import { ChannelMessageDto } from './channel/dto/channel-message.dto';
import { ChannelMessage } from 'src/entities/channel-message.entity';

@WebSocketGateway({
  namespace: 'chat',

  cors: {
    origin: '*',
  },
})
export class ChatGateway {
  constructor(
    private readonly userService: UsersService,
    private readonly channelService: ChannelService,
    private readonly channelMessageService: ChannelMessageService,
    private readonly auth: AuthService,
  ) {
    this.activeChannels = new Map<string, Channel>();
    this.activeClients = new Map<string, User>();
    // setInterval(() => {
    //   console.log(this.activeChannels);
    // }, 2000);
  }

  @WebSocketServer()
  private server: Server;

  private activeChannels: Map<string, Channel>;
  private activeClients: Map<string, User>;

  async handleConnection(client: Socket, ...args: any[]) {
    try {
      let token = client.handshake.headers.authorization.split(' ')[1];
      let data = await this.auth.validateToken(token);
      if (!data) {
        console.log('Disconnected client');
        client.disconnect();
        return;
      }
      let user: User = await this.userService.findOne(data.id);
      this.activeClients.set(client.id, user);
    } catch (error: any) {
      client.disconnect();
    }
    console.log('WS Connect', { id: client.id });
    // let test : UsersService
    //
    // const user : User = await test.findOne({id : })
    // let user = this.userService.
    // client.disconnect()
  }

  @SubscribeMessage('joinChannel')
  async handleJoinChannel(
    @MessageBody() channelId: string,
    @ConnectedSocket() client: Socket,
  ) {
    //Check if channel in map
    let channel: Channel;
    try {
      channel = await this.channelService.findUserInChannel(
        channelId,
        this.activeClients.get(client.id).id,
      );
      console.log('Channel found');
      console.log(channelId)
      console.log(channel);
      if (channel.isPublic) {
        client.join(channelId);
        this.activeChannels.set(channelId, channel);
      }
      else {
        // TODO check for membership 
      }
    } catch (e) {
      //TODO error handling
      return;
    }
  }

  @SubscribeMessage('channelMessage')
  async handleChannelMessage(
    @MessageBody() dto: ChannelMessageDto,
    @ConnectedSocket() client: Socket,
  ) {
    if (!dto.content || dto.content.trim() === '') return;
    if (client.rooms.has(dto.channelId)) {
      let data: ChannelMessage;
      try {
        data = await this.channelMessageService.createOne(
          this.activeClients.get(client.id).id,
          dto.channelId,
          dto.content,
        );
        console.log("Here is the id ", dto.channelId)
        this.server.in(dto.channelId).emit('channel/message', data);
      } catch (error) {
        // TODO handle error
        console.log(error);
      }
    }
  }

  @SubscribeMessage('leaveChannel')
  async handleLeaveChannel(
    @MessageBody() channelId: string,
    @ConnectedSocket() client: Socket,
  ) {
    console.log('A client has been leaving the channel !');
    if (client.rooms.has(channelId)) {
      client.leave(channelId);
      try {
        const sockets = await this.server.in(channelId).fetchSockets();
        if (sockets.length == 0) this.activeChannels.delete(channelId);
      } catch (error) {
        // TODO catch the error properly
        throw error;
      }
    }
  }
}
