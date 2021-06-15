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
  private player0: {
    x: number
    y: number
    height: number
    score: number
    ready: boolean
  }
  private player1: {
    x: number
    y: number
    height: number
    score: number
    ready: boolean
  }
  private ball: {
    x: number,
    y: number
  }

  constructor(private appService: AppService) {
    this.player0 = {
      x: 79.6,
      y: 540,
      height: (1920 * 0.1),
      score: 0,
      ready: false
    }
    this.player1 = {
      x: 1840.4,
      y: 540,
      height: (1920 * 0.1),
      score: 0,
      ready: false
    }
    this.ball = {
      x: (1920 / 2),
      y: (1080 / 2)
    }
  }

  @WebSocketServer()
  private server: Server

  handleConnection(client: Socket, ...args: any[]) {
    console.log('WS Connect', { id: client.id })
    
    if (!this.client0)
      this.client0 = client
    else if (!this.client1) {
      this.client1 = client
      this.client0.emit('OpponentFound', 0)
      this.client1.emit('OpponentFound', 1)
    }

    client.on('disconnect', () => {
      console.log(client.id, 'disconnected')
      if (this.client0 == client) {
        this.client1.emit('OpponentDisconnected')
        this.client1.disconnect()
      }
      else if (this.client1 == client) {
        this.client0.emit('OpponentDisconnected')
        this.client0.disconnect()
      }
      this.client0 = undefined
      this.client1 = undefined
    })
  }

  @SubscribeMessage('JoinGame')
  handleJoinGame(
    @MessageBody() data: unknown,
    @ConnectedSocket() client: Socket,
    ) {
      if (client == this.client0)
        this.player0.ready = true
      else if (client == this.client1)
        this.player1.ready = true

      if (this.player0.ready && this.player1.ready)
        this.handleGame()
  }

  @SubscribeMessage('MoveBar')
  handleMoveBar(
    @MessageBody() data: number,
    @ConnectedSocket() client: Socket,
  ) {
    //console.log('Emit', client.id, 'MoveBar', data)
    if (this.client0 == client) {
      this.player0.y = data
      this.client1.emit('OpponentMove', data)
    }
    else if (this.client1 == client) {
      this.player1.y = data
      this.client0.emit('OpponentMove', data)
    }
  }

  handleGame() {
    while (this.player0.score != 6 || this.player1.score != 6) {
        this.handleBall()
    }

  }

  handleBall() {

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

