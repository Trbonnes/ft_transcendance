import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer, WsResponse } from '@nestjs/websockets';
import { Socket, Server, Namespace } from 'socket.io'
import { AppService } from './app.service'
import GameState from './GameState.class'
import { GameGateway } from './app.gamegateway'

@WebSocketGateway({
  namespace: 'borderless',
  cors: {
    origin: '*'
  }
})
export class BorderlessGateway extends GameGateway {

  constructor(private appService: AppService) {
    super(appService)

    super.refreshBallFrame = function (gameId: string) {
      this.rooms.get(gameId)
        .ball.x += this.rooms.get(gameId).delta.dx
      this.rooms.get(gameId)
        .ball.y += this.rooms.get(gameId).delta.dy
  
      this.server.to(this.rooms.get(gameId).id)
        .emit('BallMove', this.rooms.get(gameId).ball)
  
      if (this.rooms.get(gameId).ball.y >= 1080
        || this.rooms.get(gameId).ball.y <= 0)
        this.rooms.get(gameId).ball.y = this.hitWall(this.rooms.get(gameId).ball.y)
    
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

    super.hitWall = function(y: number): number {
      console.log('non border hit')

      if(y <= 0)
        y = 1070
      else
        y = 10
  
      return y
    }
  }
}
