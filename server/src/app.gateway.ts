import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer, WsResponse } from '@nestjs/websockets';
import { Logger } from '@nestjs/common'
import { Socket, Server, Namespace } from 'socket.io'
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
  private clients: Map<string, string>

  constructor(private appService: AppService) {
    this.rooms = new Map<string, GameState>()
    this.clients = new Map<string, string>()
  }

  @WebSocketServer()
  private server: Namespace
  
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
    console.log('room number: ', this.rooms.size)
  }

  handleDisconnect(client: Socket, ...args: any[]) {
    console.log(client.id, 'disconnected')
    this.leaveGame(client)
  }

  createGame(client: Socket) {
    let room = new GameState(client)
    room.client0 = client
    this.rooms.set(room.id, room)
    console.log("create room ", room.id)
    client.join(room.id)
    this.clients.set(client.id, room.id)
  }

  joinGame(client: Socket, id: string) {
    this.clients.set(client.id, id)
    this.rooms.get(id).client1 = client
    client.join(id)
    console.log("join room ", id)
    this.rooms.get(id).client0.emit('OpponentFound', {player: 0, room: id})
    this.rooms.get(id).client1.emit('OpponentFound', {player: 1, room: id})
  }

  leaveGame(client: Socket) { //maybe need to use the db for this
    let serverSideClient: [string, string]
    for (serverSideClient of this.clients) {
      if (serverSideClient[0] == client.id)
        this.server.to(serverSideClient[1]).emit('OpponentDisconnected')
    }
    client.leave(serverSideClient[1])
    client.disconnect()
    for (let gameRoom of this.rooms.keys()) {
      if (gameRoom == serverSideClient[1])
        // this.rooms.get(gameRoom).client0.leave(serverSideClient[1])
        // this.rooms.get(gameRoom).client1.leave(serverSideClient[1])
        // this.rooms.get(gameRoom).client0.disconnect()
        // this.rooms.get(gameRoom).client1.disconnect()
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
    if (this.rooms.get(data.id).client0.id == client.id) {
      this.rooms.get(data.id).player0.y = data.y
      this.rooms.get(data.id).client1.emit('OpponentMove', data.y)
    }
    else if (this.rooms.get(data.id).client1.id == client.id) {
      this.rooms.get(data.id).player1.y = data.y
      this.rooms.get(data.id).client0.emit('OpponentMove', data.y)
    }
  }

  async handleGame(gameRoomId: string) {
    while (this.rooms.get(gameRoomId).player0.score != 6 && this.rooms.get(gameRoomId).player1.score != 6) {
      console.log('score0: ', this.rooms.get(gameRoomId).player0.score)
      console.log('score1: ', this.rooms.get(gameRoomId).player1.score)
      let score = await this.handleBall(this.rooms.get(gameRoomId))
      this.rooms.get(gameRoomId).player0.score = score.p0
      this.rooms.get(gameRoomId).player1.score = score.p1
    }
  }

  // async waitClient(gameState: GameState) {
  //   let p0Response: boolean = false
  //   let p1Response: boolean = false
  //   this.server.to(gameState.id).emit('BallMove', gameState.ball)

  //   return
  // }

  async handleBall(gameState: GameState): Promise<{ p0: number; p1: number; }> {
    gameState.delta = {
      dx : 0,
      dy : 0
    }

    console.log('handleball')
    if (gameState.player0.score > gameState.player1.score)
      gameState.delta.dx = 0.5
    else if (gameState.player1.score > gameState.player0.score)
      gameState.delta.dx = -0.5
    else if (Math.random() >= 0.5)
      gameState.delta.dx = 0.2
    else
      gameState.delta.dx = -0.2

    while (!gameState.goal) {
      gameState.ball.x += gameState.delta.dx
      gameState.ball.y += gameState.delta.dy
      this.server.to(gameState.id).emit('BallMove', gameState.ball)
      if (gameState.ball.y >= 1080 || gameState.ball.y <= 0)
        gameState.delta.dy = this.hitWall(gameState.delta.dy)
      if (gameState.ball.x <= gameState.player0.x) {
        gameState.delta = this.hitLeftBar(gameState.delta, gameState)
        if (gameState.delta.dx == 0 && gameState.delta.dy == 0) {
          gameState.goal = true
          gameState.player1.score += 1
        }
      }
      if (gameState.ball.x >= gameState.player1.x) {
        gameState.delta = this.hitRightBar(gameState.delta, gameState)
        if (gameState.delta.dx == 0 && gameState.delta.dy == 0) {
          gameState.goal = true
          gameState.player0.score += 1
        }
      }
    }

    console.log("Goal")
    this.server.to(gameState.id).emit('Goal', {scoreP0: gameState.player0.score, scoreP1: gameState.player1.score})
    return new Promise(score => {gameState.player0.score, gameState.player1.score})
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

