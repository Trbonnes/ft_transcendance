import io, { Socket, Server } from 'socket.io'
import {v4 as uuidv4} from 'uuid'

export default class GameState {
    public id: string
    public client0: Socket //= undefined
    public client1: Socket //= undefined
    public player0: {
      x: number
      y: number
      height: number
      score: number
      ready: boolean
    }
    public player1: {
      x: number
      y: number
      height: number
      score: number
      ready: boolean
    }
    public ball: {
      x: number,
      y: number
    }
    public delta = {
      dx : 0,
      dy : 0
    }
    public goal: number = -1

    constructor(client: Socket) {

        this.id = uuidv4()
        this.client0 = client
        this.client1 = undefined
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

    resetPosition() {
      this.goal = -1
      this.ball = {
          x: (1920 / 2),
          y: (1080 / 2)
      }
      this.delta = {
        dx : 0,
        dy : 0
      }
      
      this.player0.x = 79.6
      this.player0.y = 540
      this.player1.x = 1840.4
      this.player1.y = 540
    }
    
}