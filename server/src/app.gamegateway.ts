import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer, WsResponse } from '@nestjs/websockets';
import { Socket, Server, Namespace } from 'socket.io'
import { AppService } from './app.service'
import { AuthService } from './auth/auth.service';
import { User } from './entities/user.entity';
import { GameService } from './game/game.service';
import GameState from './GameState.class'
import { UsersService } from './users/users.service';

@WebSocketGateway({
  namespace: 'game',
  cors: {
    origin: '*'
  }
})
export class GameGateway {
  protected rooms: Map<string, GameState>
  protected clients: Map<string, string>

  constructor(
      protected readonly usersService: UsersService,
      protected readonly authService: AuthService,
      protected readonly gameService: GameService,
      private AppService: AppService) {
    this.rooms = new Map<string, GameState>()
    this.clients = new Map<string, string>()
  }

  @WebSocketServer()
  protected server: Namespace
  
  async handleConnection(client: Socket, ...args: any[]) {
    
    let data = client.handshake
    let joined = false
    
    const userId = client.handshake.headers.user_id as string;
    
    try {
      const token = data.headers.authorization.split(' ')[1]
      let authData = this.authService.validateTokenSync(token)
      if (authData == null) {
        client.disconnect()
        return
      }
    } catch (error: any) {
      client.disconnect()
    }

    for (let gameRoom of this.rooms.keys()) {
      if (userId == this.rooms.get(gameRoom).client0_id
      || userId == this.rooms.get(gameRoom).client1_id) {
        client.emit('AlreadyConnected')
        client.disconnect()
        return
      }
    }

    if (data.query['spectate']) {
      for (let gameRoom of this.rooms.keys()) {
        if (gameRoom == data.query['spectate']
        && this.rooms.get(gameRoom).client0
        && this.rooms.get(gameRoom).client1) {
          client.join(data.query['spectate'])
          joined = true
        }
      }
      if (joined)
        client.emit('Spectator Joined', {room: data.query['spectate']})
      else {
        client.emit('Bad id')
        client.disconnect()
      }
      return
    }

    if (data.query['friend']) {
      if (data.query['friend'] == "true") {
        this.createGame(client, true, userId)
        return
      }
      for (let gameRoom of this.rooms.keys()) {
        if (gameRoom == data.query['friend']
        && this.rooms.get(gameRoom).client0
        && !this.rooms.get(gameRoom).client1) {
          this.joinGame(client, data.query['friend'], userId)
          joined = true
        }
      }
      if (!joined) {
        client.emit('Bad id')
        client.disconnect()
      }
      return
    }

    if (!this.rooms.size) {
      this.createGame(client, false, userId)
      joined = true
    }
    else {
      try {
        this.rooms.forEach(
          (game: GameState, id: string) => {
            if (!game.client1 && !game.friend) {
              this.joinGame(client, id, userId)
              throw 'BreakException'
            }
          }
        )
      } catch (e) { joined = true }

      if (!joined)
        this.createGame(client, false, userId)
    }

  }

  handleDisconnect(client: Socket, ...args: any[]) {
    this.leaveGame(client)
  }

  createGame(client: Socket, friend: boolean, userId: string) {
    let room = new GameState(client)
    room.friend = friend
    room.client0 = client
    room.client0_id = userId
    this.rooms.set(room.id, room)
    client.emit('gameId', room.id)
    client.join(room.id)
    this.clients.set(client.id, room.id)
  }

  joinGame(client: Socket, id: string, userId: string) {
    this.clients.set(client.id, id)
    this.rooms.get(id).client1 = client
    client.join(id)
    this.rooms.get(id).client1_id = userId
    this.gameService.create(id, [this.rooms.get(id).client0_id, this.rooms.get(id).client1_id])
    this.rooms.get(id).client0
      .emit('OpponentFound', {player: 0, room: id})
    this.rooms.get(id).client1
      .emit('OpponentFound', {player: 1, room: id})
  }

  leaveGame(client: Socket) {
    let serverSideClient: [string, string]
    for (serverSideClient of this.clients) {
      if (serverSideClient[0] == client.id) {
        break
      }
    }

    for (let gameRoom of this.rooms.keys()) {
      if (gameRoom == serverSideClient[1]) {
        if (client.id == this.rooms.get(gameRoom).client0.id) {
          this.gameService.update(gameRoom, this.rooms.get(gameRoom).client1_id, this.rooms.get(gameRoom).client0_id)
          this.rooms.get(gameRoom).disconnection = true
          break
        }
        else if (client.id == this.rooms.get(gameRoom).client1.id) {
          this.gameService.update(gameRoom, this.rooms.get(gameRoom).client0_id, this.rooms.get(gameRoom).client1_id)
          this.rooms.get(gameRoom).disconnection = true
          break
        }
        else
          break
      }
    }

    client.leave(serverSideClient[1])
    if (!this.rooms.get(serverSideClient[1])?.client1)
      this.rooms.delete(serverSideClient[1])
    client.disconnect()
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

      if (this.rooms.get(gameRoomId).player0.ready
        && this.rooms.get(gameRoomId).player1.ready)
        this.handleGame(gameRoomId)
  }

  @SubscribeMessage('MoveBar')
  handleMoveBar(
    @MessageBody() data: {id: string, y: number},
    @ConnectedSocket() client: Socket,
  ) {
    if (!this.rooms.get(data.id) || this.rooms.get(data.id).disconnection)
      return 

    if (this.rooms.get(data.id).client0.id == client.id) {
      this.rooms.get(data.id).player0.y = data.y
      this.rooms.get(data.id).client1.emit('OpponentMove', data.y)
      this.server.to(data.id).emit('SpectatorMove', { side: 0, y: data.y })
    }

    else if (this.rooms.get(data.id).client1.id == client.id) {
      this.rooms.get(data.id).player1.y = data.y
      this.rooms.get(data.id).client0.emit('OpponentMove', data.y)
      this.server.to(data.id).emit('SpectatorMove', { side: 1, y: data.y })
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

    this.server.to(this.rooms.get(gameId).id)
      .emit('Goal', {
        scoreP0: this.rooms.get(gameId).player0.score,
        scoreP1: this.rooms.get(gameId).player1.score
      })
    
    this.handleGame(gameId)
  }

  async handleGame(gameId: string) {
    if (this.rooms.get(gameId).disconnection) {
      this.server.to(gameId)
          .emit('OpponentDisconnected')
      this.rooms.delete(gameId)
      return 
    }

    if (this.rooms.get(gameId).player0.score != 6
      && this.rooms.get(gameId).player1.score != 6) {
      this.rooms.get(gameId).resetPosition()
      this.handleBall(gameId)
    }
    else {
      if (this.rooms.get(gameId).player0.score == 6)
        this.gameService.update(gameId, this.rooms.get(gameId).client0_id, this.rooms.get(gameId).client1_id)
      else 
        this.gameService.update(gameId, this.rooms.get(gameId).client1_id, this.rooms.get(gameId).client0_id)
      this.server.to(this.rooms.get(gameId).id)
        .emit('End', {
          scoreP0: this.rooms.get(gameId).player0.score,
          scoreP1: this.rooms.get(gameId).player1.score
        })
      this.rooms.delete(gameId)
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

    this.hitWall(gameId)
  
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

  hitWall(gameId: string) {
    let dy = this.rooms.get(gameId).delta.dy

    if (this.rooms.get(gameId).ball.y >= 1080
      || this.rooms.get(gameId).ball.y <= 0) {

      if(dy > 0)
        this.rooms.get(gameId).delta.dy = -Math.abs(dy)
      else
        this.rooms.get(gameId).delta.dy = Math.abs(dy)
    }
  }

  hitLeftBar(delta: {dx:number, dy:number}, gameState: GameState): {dx:number, dy:number} {

    if (gameState.ball.y <= (gameState.player0.y + gameState.player0.height / 2)
      && gameState.ball.y >= (gameState.player0.y - gameState.player0.height / 2)) {
      let hitZone = gameState.ball.y - gameState.player0.y
      if (hitZone < 0) { // Ball hit bar above center
        delta.dy = hitZone / (gameState.player0.height / 2)
        delta.dy += -Math.random() - 1
      }
      else if (hitZone > 0) { // Ball hit bar below center
        delta.dy = hitZone / (gameState.player0.height / 2)
        delta.dy += Math.random() + 1
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
        delta.dy += -Math.random() - 1
      }
      else if (hitZone > 0) { // Ball hit bar below center
        delta.dy = hitZone / (gameState.player1.height / 2)
        delta.dy += Math.random() + 1
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
