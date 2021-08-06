import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsResponse,
} from '@nestjs/websockets';
import { Socket, Server, Namespace } from 'socket.io';
import { Channel } from './../entities/channel.entity';
import { User } from './../entities/user.entity';

@WebSocketGateway({
  namespace: 'chat',
  cors: {
    origin: '*',
  },
})
export class ChatGateway {
  constructor() {
    setInterval(() => {
      console.log(this.activeClients);
    }, 2000);
    this.activeChannels = [];
    this.activeClients = [];
  }

  @WebSocketServer()
  private server: Server;

  private activeChannels: { [id: string]: Channel }[]; // Room id <==> Channel
  private activeClients: { [id: string]: User }[]; // Room id <==> User

  handleConnection(client: Socket, ...args: any[]) {
    console.log('WS Connect', { id: client.id });
  }

  @SubscribeMessage('chat')
  handleEvent(@MessageBody() data: string, @ConnectedSocket() client: Socket) {
    const ret = 'hello';
    console.log('Emit', client.id, 'chat', ret);
    console.log('Here is the data ' + data);
    client.emit('chat', ret);
  }
}
