import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer, WsResponse } from '@nestjs/websockets';
import { Socket, Server, Namespace } from 'socket.io'
import { AppService } from './app.service'
import GameState from './GameState.class'
import { GameGateway } from './app.gamegateway'
import { UsersService } from './users/users.service';
import { AuthService } from './auth/auth.service';

@WebSocketGateway({
  namespace: 'borderless',
  cors: {
    origin: '*'
  }
})
export class BorderlessGateway extends GameGateway {

  constructor(
    protected readonly usersService: UsersService,
    protected readonly authService: AuthService,
     private appService: AppService) {
    super(usersService, authService, appService)

    super.hitWall = function(gameId: string) {
      if (this.rooms.get(gameId).ball.y >= 1080)
        this.rooms.get(gameId).ball.y = 10

      if (this.rooms.get(gameId).ball.y <= 0)
        this.rooms.get(gameId).ball.y = 1070
    }
  }
}
