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
  private player0: Socket = undefined
  private player1: Socket = undefined

  constructor(private appService: AppService) {}

  @WebSocketServer()
  private server: Server

  handleConnection(client: Socket, ...args: any[]) {
    console.log('WS Connect', { id: client.id })
    client.on('disconnect', () => {
      console.log(client.id, 'disconnected')
      if (this.player0 == client)
        this.player0 = undefined
      else if (this.player1 == client)
        this.player1 = undefined
    })
  }

  @SubscribeMessage('JoinGame')
  handleJoinGame(
    @MessageBody() data: unknown,
    @ConnectedSocket() client: Socket,
    ) {
      let ret: number
      if (!this.player0) {
        this.player0 = client
        ret = 0
      }
      else if (!this.player1) {
        this.player1 = client
        ret = 1
        this.player0.emit('OpponentFound')
        this.player1.emit('OpponentFound')
      }
      console.log('Emit', client.id, 'JoinGame', ret)
      return ret
  }

  @SubscribeMessage('MoveBar')
  handleMoveBar(
    @MessageBody() data: number,
    @ConnectedSocket() client: Socket,
  ) {
    console.log('Emit', client.id, 'MoveBar', data)
    if (this.player0 == client)
      this.player1.emit('OpponentMove', data)
    else if (this.player1 == client)
      this.player0.emit('OpponentMove', data)
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

