import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsResponse,
} from '@nestjs/websockets';
import { UseGuards, Req } from '@nestjs/common';
import { Socket, Server, Namespace } from 'socket.io';
import { Channel } from './../entities/channel.entity';
import { User } from './../entities/user.entity';
import { UsersService } from './../users/users.service';
import { AuthService } from 'src/auth/auth.service';
import { ChannelService } from 'src/chat/channel/channel.service';
import { ChannelMessageDto } from './channel/dto/channel-message.dto';

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
    if (this.activeChannels.has(channelId)) client.join(channelId);
    else {
      let channel: Channel;
      try {
        channel = await this.channelService.getById(channelId);
      } catch (error) {
        // TODO check if not found
        return;
      }
      this.activeChannels.set(channelId, channel);
      client.join(channelId);
    }
  }

  @SubscribeMessage('channelMessage')
  async handleChannelMessage(
    @MessageBody() dto: ChannelMessageDto,
    @ConnectedSocket() client: Socket,
  ) {
    console.log('it seems that a message has been received');
    if (dto.content.trim() === '') return;
    if (client.rooms.has(dto.channelId)) {
      this.server.in(dto.channelId).emit('channel/message', {
        id: 'sasdffasdf',
        senderId: this.activeClients.get(client.id).id,
        channelId: dto.channelId,
        content: dto.content,
      });
      console.log('Message received for a room that is valid !');
      console.log(dto.content.trim());
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
