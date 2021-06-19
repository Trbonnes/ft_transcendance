import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer, WsResponse } from '@nestjs/websockets';
import { Logger } from '@nestjs/common'
import { Socket, Server } from 'socket.io'
import { AppService } from './app.service'
import GameState from './GameState.class'



@WebSocketGateway({
  namespace: 'game',
  cors: {
    origin: '*'
  }
})
export class GameGateway {
  private rooms: Map<string, GameState>

  constructor(private appService: AppService) {
  }

  @WebSocketServer()
  private server: Server

  BreakException
  
  handleConnection(client: Socket, ...args: any[]) {
    console.log('WS Connect', { id: client.id })
    let joined = false
    if (!this.rooms.size) {
      this.createGame(client)
      joined = true
    }
    else {
      try{
        this.rooms.forEach((game: GameState, id: string) => {
          if (!game.client1) {
            this.joinGame(client, id)
            throw 'BreakException'
          }
        })
      } catch (e) { joined = true }
      if (!joined)
        this.createGame(client)
    }
  }

  handleDisconnect(client: Socket, ...args: any[]) {
    this.leaveGame(client)
    console.log(client.id, 'disconnected')
  }

  createGame(client: Socket) {
    let room = new GameState(client)
    this.rooms.set(room.id, room)
    client.join(room.id)
  }

  joinGame(client: Socket, id: string) {
    this.rooms.get(id).client1 = client
    client.join(id)
    this.rooms.get(id).client0.emit('OpponentFound', {player: 0, room: id})
    this.rooms.get(id).client1.emit('OpponentFound', {player: 1, room: id})
  }

  leaveGame(client: Socket) {
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

  handleBall(gameState: GameState): {p0:number, p1:number} {
    let delta = {
      dx : 0,
      dy : 0
    }

    if (gameState.player0.score > gameState.player1.score)
      delta.dx = 0.5
    else if (gameState.player1.score > gameState.player0.score)
      delta.dx = -0.5
    else if (Math.random() >= 0.5)
      delta.dx = 0.2
    else
      delta.dx = -0.2

    while (!gameState.goal) {
      gameState.ball.x += delta.dx
      gameState.ball.y += delta.dy
      this.server.to(gameState.id).emit('BallMove', gameState.ball)
      if (gameState.ball.y >= 1080 || gameState.ball.y <= 0)
        delta.dy = this.hitWall(delta.dy)
      if (gameState.ball.x <= gameState.player0.x) {
        delta = this.hitLeftBar(delta, gameState)
        if (delta.dx == 0 && delta.dy == 0) {
          gameState.goal = true
          gameState.player1.score += 1
        }
      }
      if (gameState.ball.x >= gameState.player1.x) {
        delta = this.hitRightBar(delta, gameState)
        if (delta.dx == 0 && delta.dy == 0) {
          gameState.goal = true
          gameState.player0.score += 1
        }
      }
    }

    this.server.to(gameState.id).emit('Goal', {scoreP0: gameState.player0.score, scoreP1: gameState.player1.score})

    return {p0: gameState.player0.score, p1: gameState.player1.score}
  }

  hitWall(dy: number): number {

    if(dy > 0)
      dy = -Math.abs(dy)
    else
      dy = Math.abs(dy)

    return dy
  }

  hitLeftBar(delta: {dx:number, dy:number}, gameState: GameState): {dx:number, dy:number} {

    if (gameState.ball.y <= (gameState.player0.y + gameState.player0.height / 2) || gameState.ball.y <= (gameState.player0.y - gameState.player0.height / 2)) {
      let hitZone = gameState.ball.y - gameState.player0.y
      if (hitZone < 0) { // Ball hit bar above center
        delta.dy = hitZone / (gameState.player0.height / 2)
      }
      else if (hitZone > 0) { // Ball hit bar below center
        delta.dy = hitZone / (gameState.player0.height / 2)
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

  hitRightBar(delta: {dx:number, dy:number}, gameState: GameState): {dx:number; dy:number;} {

    if (gameState.ball.y <= (gameState.player1.y + gameState.player1.height / 2) || gameState.ball.y <= (gameState.player1.y - gameState.player1.height / 2)) {
      let hitZone = gameState.ball.y - gameState.player1.y
      if (hitZone < 0) { // Ball hit bar above center
        delta.dy = hitZone / (gameState.player1.height / 2)
      }
      else if (hitZone > 0) { // Ball hit bar below center
        delta.dy = hitZone / (gameState.player1.height / 2)
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

