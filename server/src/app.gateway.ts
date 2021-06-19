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
  private rooms: Map<string, GameRoom>

  constructor(private appService: AppService) {
  }

  @WebSocketServer()
  private server: Server

  BreakException
  
  handleConnection(client: Socket, ...args: any[]) {
    console.log('WS Connect', { id: client.id })
    let joined = false
    if (!this.rooms.size) {
      this.createRoom(client)
      joined = true
    }
    else {
      try{
        this.rooms.forEach((room: GameRoom, id: string) => {
          if (!room.client1) {
            this.joinRoom(client, id)
            throw 'BreakException'
          }
        })
      } catch (e) { joined = true }
      if (!joined)
        this.createRoom(client)
    }
  }

  handleDisconnect(client: Socket, ...args: any[]) {
    this.leaveRoom(client)
    console.log(client.id, 'disconnected')
  }

  createRoom(client: Socket) {
    let room = new GameRoom(client)
    this.rooms.set(room.id, room)
    client.join(room.id)
  }

  joinRoom(client: Socket, id: string) {
    this.rooms.get(id).client1 = client
    client.join(id)
    this.rooms.get(id).client0.emit('OpponentFound', {player: 0, room: id})
    this.rooms.get(id).client1.emit('OpponentFound', {player: 1, room: id})
  }

  leaveRoom(client: Socket) {
    let room = this.server.sockets.adapter.sids.get(client.id)
    let clients = this.server.sockets.adapter.rooms.get(room.values()[0])
    this.server.to(room.values()[0]).emit('OpponentDisconnected')
    clients.values()[0].leave(room.values()[0])
    clients.values()[1].leave(room.values()[0])
    client.disconnect()
    for (let gameRoom of this.rooms.keys()) {
      if (gameRoom == room.values()[0])
        this.rooms.delete(gameRoom)
    }
  }

  @SubscribeMessage('JoinGame')
  handleJoinGame(
    @MessageBody() data: string,
    @ConnectedSocket() client: Socket,
    ) {

      let gameRoomId : string

      for (gameRoomId of this.rooms.keys()) {
        if (gameRoomId == data) {
          if (this.rooms.get(gameRoomId).client0.id == client.id)
            this.rooms.get(gameRoomId).player0.ready = true
          else if (this.rooms.get(gameRoomId).client1.id == client.id)
            this.rooms.get(gameRoomId).player1.ready = true
        }
      }

      console.log('Join', client.id, this.rooms.get(gameRoomId).player0.ready, this.rooms.get(gameRoomId).player1.ready)
      if (this.rooms.get(gameRoomId).player0.ready && this.rooms.get(gameRoomId).player1.ready) {
        console.log('Game Start')
        this.handleGame(gameRoomId)
      }
  }

  @SubscribeMessage('MoveBar')
  handleMoveBar(
    @MessageBody() data: {id: string, y: number},
    @ConnectedSocket() client: Socket,
  ) {
    //console.log('Emit', client.id, 'MoveBar', data)
    if (this.rooms.get(data.id).client0 == client) {
      this.rooms.get(data.id).player0.y = data.y
      this.rooms.get(data.id).client1.emit('OpponentMove', data.y)
    }
    else if (this.rooms.get(data.id).client1 == client) {
      this.rooms.get(data.id).player1.y = data.y
      this.rooms.get(data.id).client0.emit('OpponentMove', data.y)
    }
  }

  handleGame(gameRoomId: string) {
    while (this.rooms.get(gameRoomId).player0.score != 6 && this.rooms.get(gameRoomId).player1.score != 6) {
      console.log('score0: ', this.rooms.get(gameRoomId).player0.score)
      console.log('score1: ', this.rooms.get(gameRoomId).player1.score)
      let score = this.handleBall(this.rooms.get(gameRoomId))
      this.rooms.get(gameRoomId).player0.score = score.p0
      this.rooms.get(gameRoomId).player1.score = score.p1
    }
  }

  handleBall(gameRoom: GameRoom): {p0:number, p1:number} {
    let delta = {
      dx : 0,
      dy : 0
    }

    if (gameRoom.player0.score > gameRoom.player1.score)
      delta.dx = 0.5
    else if (gameRoom.player1.score > gameRoom.player0.score)
      delta.dx = -0.5
    else if (Math.random() >= 0.5)
      delta.dx = 0.2
    else
      delta.dx = -0.2

    while (!gameRoom.goal) {
      gameRoom.ball.x += delta.dx
      gameRoom.ball.y += delta.dy
      this.server.to(gameRoom.id).emit('BallMove', gameRoom.ball)
      if (gameRoom.ball.y >= 1080 || gameRoom.ball.y <= 0)
        delta.dy = this.hitWall(delta.dy)
      if (gameRoom.ball.x <= gameRoom.player0.x) {
        delta = this.hitLeftBar(delta, gameRoom)
        if (delta.dx == 0 && delta.dy == 0) {
          gameRoom.goal = true
          gameRoom.player1.score += 1
        }
      }
      if (gameRoom.ball.x >= gameRoom.player1.x) {
        delta = this.hitRightBar(delta, gameRoom)
        if (delta.dx == 0 && delta.dy == 0) {
          gameRoom.goal = true
          gameRoom.player0.score += 1
        }
      }
    }

    this.server.to(gameRoom.id).emit('Goal', {scoreP0: gameRoom.player0.score, scoreP1: gameRoom.player1.score})

    return {p0: gameRoom.player0.score, p1: gameRoom.player1.score}
  }

  hitWall(dy: number): number {

    if(dy > 0)
      dy = -Math.abs(dy)
    else
      dy = Math.abs(dy)

    return dy
  }

  hitLeftBar(delta: {dx:number, dy:number}, gameRoom: GameRoom): {dx:number, dy:number} {

    if (gameRoom.ball.y <= (gameRoom.player0.y + gameRoom.player0.height / 2) || gameRoom.ball.y <= (gameRoom.player0.y - gameRoom.player0.height / 2)) {
      let hitZone = gameRoom.ball.y - gameRoom.player0.y
      if (hitZone < 0) { // Ball hit bar above center
        delta.dy = hitZone / (gameRoom.player0.height / 2)
      }
      else if (hitZone > 0) { // Ball hit bar below center
        delta.dy = hitZone / (gameRoom.player0.height / 2)
      }
      else 
        delta.dy = 0

      delta.dx = Math.abs(delta.dx)
      delta.dx += 0.02
    }
    else {
      delta.dx = 0
      delta.dy = 0
    }

    return delta
  }

  hitRightBar(delta: {dx:number, dy:number}, gameRoom: GameRoom): {dx:number; dy:number;} {

    if (gameRoom.ball.y <= (gameRoom.player1.y + gameRoom.player1.height / 2) || gameRoom.ball.y <= (gameRoom.player1.y - gameRoom.player1.height / 2)) {
      let hitZone = gameRoom.ball.y - gameRoom.player1.y
      if (hitZone < 0) { // Ball hit bar above center
        delta.dy = hitZone / (gameRoom.player1.height / 2)
      }
      else if (hitZone > 0) { // Ball hit bar below center
        delta.dy = hitZone / (gameRoom.player1.height / 2)
      }
      else 
        delta.dy = 0

      delta.dx = -Math.abs(delta.dx)
      delta.dx -= 0.02
    }
    else {
      delta.dx = 0
      delta.dy = 0
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

