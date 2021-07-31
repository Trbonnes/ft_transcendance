import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsResponse,
} from '@nestjs/websockets';
import { Socket, Server, Namespace } from 'socket.io';

@WebSocketGateway({
  namespace: 'chat',
  cors: {
    origin: '*',
  },
})
export class ChatGateway {
  constructor() {}

  @WebSocketServer()
  private server: Server;

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
