import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer, WsResponse } from '@nestjs/websockets';
import { Logger } from '@nestjs/common'
import { Socket, Server } from 'socket.io'
import { AppService } from './app.service'


@WebSocketGateway({
  namespace: 'game',
  cors: {
    origin: '*'
  }
})
export class GameGateway {
  private client0: Socket = undefined
  private client1: Socket = undefined

  constructor(private appService: AppService) {}

  @WebSocketServer()
  private server: Server

  handleConnection(client: Socket, ...args: any[]) {
    console.log('WS Connect', { id: client.id })
    client.on('disconnect', () => {
      console.log(client.id, 'disconnected')
      if (this.client0 == client)
        this.client1.emit('OpponentDisconnected')
      else if (this.client1 == client)
        this.client0.emit('OpponentDisconnected')
      this.client0 = undefined
      this.client1 = undefined
    })
  }

  @SubscribeMessage('JoinGame')
  handleJoinGame(
    @MessageBody() data: unknown,
    @ConnectedSocket() client: Socket,
    ) {
      let ret: number
      if (!this.client0) {
        this.client0 = client
        ret = 0
      }
      else if (!this.client1) {
        this.client1 = client
        ret = 1
        this.client0.emit('OpponentFound')
        this.client1.emit('OpponentFound')
      }
      console.log('Emit', client.id, 'JoinGame', ret)
      return ret
  }

  @SubscribeMessage('MoveBar')
  handleMoveBar(
    @MessageBody() data: number,
    @ConnectedSocket() client: Socket,
  ) {
    //console.log('Emit', client.id, 'MoveBar', data)
    if (this.client0 == client)
      this.client1.emit('OpponentMove', data)
    else if (this.client1 == client)
      this.client0.emit('OpponentMove', data)
  }

}

@WebSocketGateway({
  namespace: 'chat',
  cors: {
    origin: '*'
  }
})
export class ChatGateway {
  constructor(private appService: AppService) {}

  @WebSocketServer()
  private server: Server

  handleConnection(client: Socket, ...args: any[]) {
    console.log('WS Connect', { id: client.id })
  }

  @SubscribeMessage('chat')
  handleEvent(
    @MessageBody() data: unknown,
    @ConnectedSocket() client: Socket,
    ) {
      const ret = 'hello'
      console.log('Emit', client.id, 'chat', ret)
      client.emit('chat', ret)
  }

}

