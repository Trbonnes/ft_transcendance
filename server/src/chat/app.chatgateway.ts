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

@WebSocketGateway({
  namespace: 'chat',

  cors: {
    origin: '*',
  },
})
export class ChatGateway {
  constructor(
    private readonly userService: UsersService,
    private readonly auth: AuthService,
  ) {
    setInterval(() => {
      console.log(this.activeClients);
    }, 2000);
    this.activeChannels = new Map<string, Channel>();
    this.activeClients = new Map<string, User>();
  }

  @WebSocketServer()
  private server: Server;

  private activeChannels: Map<string, Channel>;
  private activeClients: Map<string, User>;

  async handleConnection(client: Socket, ...args: any[]) {
    let token = client.handshake.headers.authorization.split(' ')[1];
    try {
      let data = await this.auth.validateToken(token);

      if (!data) client.disconnect();
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

  @SubscribeMessage('chat')
  handleEvent(@MessageBody() data: string, @ConnectedSocket() client: Socket) {
    const ret = 'hello';
    console.log('Emit', client.id, 'chat', ret);
    console.log('Here is the data ' + data);
    client.emit('chat', ret);
  }
}
