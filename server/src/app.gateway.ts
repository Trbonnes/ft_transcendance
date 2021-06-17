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
  private goal: boolean = false

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
      console.log('Join', client.id, this.player0.ready, this.player1.ready)
      if (this.player0.ready && this.player1.ready) {
        console.log('Game Start')
        this.handleGame()
      }
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

  resetPosition() {
    this.ball.x = (1920 / 2)
    this.ball.y = (1080 / 2)
    this.player0.x = 79.6
    this.player0.y = 540
    this.player1.x = 1840.4
    this.player1.y = 540
  }

  handleGame() {
    console.log('score0: ', this.player0.score)
    console.log('score1: ', this.player1.score)
    if (this.player0.score != 6 && this.player1.score != 6) {
      //this.resetPosition()
      this.handleBall()
    }
  }

  handleBall() {
    this.goal = false
    let delta = {
      dx : 0,
      dy : 0
    }

    if (this.player0.score > this.player1.score)
      delta.dx = 0.5
    else if (this.player1.score > this.player0.score)
      delta.dx = -0.5
    else if (Math.random() >= 0.5)
      delta.dx = 0.2
    else
      delta.dx = -0.2

    while (!this.goal) {
      this.ball.x += delta.dx
      this.ball.y += delta.dy
      this.client0.emit('BallMove', this.ball)
      this.client1.emit('BallMove', this.ball)
      if (this.ball.y >= 1080 || this.ball.y <= 0)
        delta.dy = this.hitWall(delta.dy)
      if (this.ball.x <= this.player0.x)
        delta = this.hitLeftBar(delta)
      if (this.ball.x >= this.player1.x)
        delta = this.hitRightBar(delta)
    }

    this.client0.emit('Goal', {scoreP0: this.player0.score, scoreP1: this.player1.score})
    this.client1.emit('Goal', {scoreP0: this.player0.score, scoreP1: this.player1.score})

    console.log('score0: ', this.player0.score)
    console.log('score1: ', this.player1.score)

    return 
  }

  hitWall(dy: number): number {

    if(dy > 0)
      dy = -Math.abs(dy)
    else
      dy = Math.abs(dy)

    return dy
  }

  hitLeftBar(delta: {dx:number, dy:number}): {dx:number; dy:number;} {

    if (this.ball.y <= (this.player0.y + this.player0.height / 2) || this.ball.y <= (this.player0.y - this.player0.height / 2)) {
      let hitZone = this.ball.y - this.player0.y
      if (hitZone < 0) { // Ball hit bar above center
        delta.dy = hitZone / (this.player0.height / 2)
      }
      else if (hitZone > 0) { // Ball hit bar below center
        delta.dy = hitZone / (this.player0.height / 2)
      }
      else 
        delta.dy = 0

      delta.dx = Math.abs(delta.dx)
      delta.dx += 0.02
    }
    else {
      delta.dx = 0
      delta.dy = 0
      this.goal = true
      this.player1.score += 1
    }

    return delta
  }

  hitRightBar(delta: {dx:number, dy:number}): {dx:number; dy:number;} {

    if (this.ball.y <= (this.player1.y + this.player1.height / 2) || this.ball.y <= (this.player1.y - this.player1.height / 2)) {
      let hitZone = this.ball.y - this.player1.y
      if (hitZone < 0) { // Ball hit bar above center
        delta.dy = hitZone / (this.player1.height / 2)
      }
      else if (hitZone > 0) { // Ball hit bar below center
        delta.dy = hitZone / (this.player1.height / 2)
      }
      else 
        delta.dy = 0

      delta.dx = -Math.abs(delta.dx)
      delta.dx -= 0.02
    }
    else {
      delta.dx = 0
      delta.dy = 0
      this.goal = true
      this.player0.score += 1
    }

    return delta
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

