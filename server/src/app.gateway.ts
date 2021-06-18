import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer, WsResponse } from '@nestjs/websockets';
import { Logger } from '@nestjs/common'
import { Socket, Server } from 'socket.io'
import { AppService } from './app.service'
import GameRoom from './GameRoom.class'



@WebSocketGateway({
  namespace: 'game',
  cors: {
    origin: '*'
  }
})
export class GameGateway {
  private rooms: GameRoom[] = []
  private roomNumber: number = 0

  constructor(private appService: AppService) {
  }

  @WebSocketServer()
  private server: Server

  handleConnection(client: Socket, ...args: any[]) {
    console.log('WS Connect', { id: client.id })

    if (!this.rooms)
      this.createRoom(client)
    else if (!this.rooms[this.roomNumber].client1) {
      this.joinRoom(client, this.roomNumber)
    }
    else
      this.createRoom(client)
  }

  handleDisconnect(client: Socket, ...args: any[]) {
    this.leaveRoom(client)
    console.log(client.id, 'disconnected')
  }

  createRoom(client: Socket) {
    let room = new GameRoom(client)
    this.rooms.push(room)
    client.join(room.id)
    this.roomNumber++
  }

  joinRoom(client: Socket, index: number) {
    let roomId = this.rooms[index].id
    this.rooms[index].client1 = client
    client.join(roomId)

    this.rooms[index].client0.emit('OpponentFound', {player: 0, room: roomId})
    this.rooms[index].client1.emit('OpponentFound', {player: 1, room: roomId})
  }

  leaveRoom(client: Socket) {
    let room = this.server.sockets.adapter.sids.get(client.id)
    let clients = this.server.sockets.adapter.rooms.get(room.values()[0])
    this.server.to(room.values()[0]).emit('OpponentDisconnected')
    clients.values()[0].leave(room.values()[0])
    clients.values()[1].leave(room.values()[0])
    client.disconnect()
    for (let gameRoom of this.rooms) {
      if (gameRoom.id == room.values()[0])
        this.rooms.splice(this.rooms.indexOf(gameRoom))
    }
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
    this.resetPosition() 

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

