import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer, WsResponse } from '@nestjs/websockets';
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
      try {
        this.rooms.forEach(
          (game: GameState, id: string) => {
            if (!game.client1) {
              this.joinGame(client, id)
              throw 'BreakException'
            }
          }
        )
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
    this.rooms.get(id).client0
      .emit('OpponentFound', {player: 0, room: id})
    this.rooms.get(id).client1
      .emit('OpponentFound', {player: 1, room: id})
  }

  leaveGame(client: Socket) { //maybe need to use the db for this
    let serverSideClient: [string, string]
    for (serverSideClient of this.clients) {
      if (serverSideClient[0] == client.id)
        this.server.to(serverSideClient[1])
          .emit('OpponentDisconnected')
    }

    client.leave(serverSideClient[1])
    client.disconnect()

    for (let gameRoom of this.rooms.keys()) {
      if (gameRoom == serverSideClient[1])
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

      console.log('Join',
        client.id,
        this.rooms.get(gameRoomId).player0.ready,
        this.rooms.get(gameRoomId).player1.ready
      )

      if (this.rooms.get(gameRoomId).player0.ready
        && this.rooms.get(gameRoomId).player1.ready) {
        console.log('Game Start')
        this.handleGame(gameRoomId)
      }
  }

  @SubscribeMessage('MoveBar')
  handleMoveBar(
    @MessageBody() data: {id: string, y: number},
    @ConnectedSocket() client: Socket,
  ) {
    if (this.rooms.get(data.id).client0.id == client.id) {
      this.rooms.get(data.id).player0.y = data.y
      this.rooms.get(data.id).client1.emit('OpponentMove', data.y)
    }
    else if (this.rooms.get(data.id).client1.id == client.id) {
      this.rooms.get(data.id).player1.y = data.y
      this.rooms.get(data.id).client0.emit('OpponentMove', data.y)
    }
  }

  waitForGoal(gameId: string) {
    while (this.refreshBallFrame(gameId) == -1) {
      setTimeout( () => {
          this.waitForGoal(gameId);
      }, 16);
      return;
    }
    if (this.rooms.get(gameId).goal == 0)
      this.rooms.get(gameId).player0.score++
    if (this.rooms.get(gameId).goal == 1)
      this.rooms.get(gameId).player1.score++

    console.log("Goal")
    this.server.to(this.rooms.get(gameId).id)
      .emit('Goal', {
        scoreP0: this.rooms.get(gameId).player0.score,
        scoreP1: this.rooms.get(gameId).player1.score
      })
    
    this.handleGame(gameId)
  }

  async handleGame(gameId: string) {
    console.log('handleGame')
    if (this.rooms.get(gameId).player0.score != 6
      && this.rooms.get(gameId).player1.score != 6) {
      console.log('score0: ', this.rooms.get(gameId).player0.score)
      console.log('score1: ', this.rooms.get(gameId).player1.score)

      this.rooms.get(gameId).resetPosition()

      this.handleBall(gameId)
    }
    else {
      console.log('End')
      this.server.to(this.rooms.get(gameId).id)
        .emit('End', {
          scoreP0: this.rooms.get(gameId).player0.score,
          scoreP1: this.rooms.get(gameId).player1.score
        })
      }
  }

  async handleBall(gameId: string) {
    if (this.rooms.get(gameId).player0.score > this.rooms.get(gameId).player1.score)
      this.rooms.get(gameId).delta.dx = 5
    else if (this.rooms.get(gameId).player1.score > this.rooms.get(gameId).player0.score)
      this.rooms.get(gameId).delta.dx = -5
    
    else if (Math.random() >= 0.5)
      this.rooms.get(gameId).delta.dx = 5
    else
      this.rooms.get(gameId).delta.dx = -5

    this.waitForGoal(gameId)
  }

  refreshBallFrame(gameId: string) {
    this.rooms.get(gameId)
      .ball.x += this.rooms.get(gameId).delta.dx
    this.rooms.get(gameId)
      .ball.y += this.rooms.get(gameId).delta.dy

    this.server.to(this.rooms.get(gameId).id)
      .emit('BallMove', this.rooms.get(gameId).ball)

    if (this.rooms.get(gameId).ball.y >= 1080
      || this.rooms.get(gameId).ball.y <= 0)
      this.rooms.get(gameId).delta.dy = this.hitWall(this.rooms.get(gameId).delta.dy)
  
    if (this.rooms.get(gameId).ball.x <= this.rooms.get(gameId).player0.x) {
      this.rooms.get(gameId).delta = this.hitLeftBar(this.rooms.get(gameId).delta,this.rooms.get(gameId))
      if (this.rooms.get(gameId).delta.dx == 0
        && this.rooms.get(gameId).delta.dy == 0) {
        this.rooms.get(gameId).goal = 1
      }
    }

    if (this.rooms.get(gameId).ball.x >= this.rooms.get(gameId).player1.x) {
      this.rooms.get(gameId).delta = this.hitRightBar(this.rooms.get(gameId).delta, this.rooms.get(gameId))
      if (this.rooms.get(gameId).delta.dx == 0
        && this.rooms.get(gameId).delta.dy == 0) {
        this.rooms.get(gameId).goal = 0
      }
    }

    return this.rooms.get(gameId).goal
  }

  hitWall(dy: number): number {
    if(dy > 0)
      dy = -Math.abs(dy)
    else
      dy = Math.abs(dy)

    return dy
  }

  hitLeftBar(delta: {dx:number, dy:number}, gameState: GameState): {dx:number, dy:number} {

    if (gameState.ball.y <= (gameState.player0.y + gameState.player0.height / 2)
      && gameState.ball.y >= (gameState.player0.y - gameState.player0.height / 2)) {
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
      delta.dx += 2
    }
    else {
      delta.dx = 0
      delta.dy = 0
    }

    return delta
  }

  hitRightBar(delta: {dx:number, dy:number}, gameState: GameState): {dx:number; dy:number;} {

    if (gameState.ball.y <= (gameState.player1.y + gameState.player1.height / 2)
      && gameState.ball.y >= (gameState.player1.y - gameState.player1.height / 2)) {
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
      delta.dx -= 2
    }
    else {
      delta.dx = 0
      delta.dy = 0
    }

    return delta
  }
}
