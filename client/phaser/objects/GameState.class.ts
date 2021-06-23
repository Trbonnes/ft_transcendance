import { io, Socket } from 'socket.io-client'

export default class GameState {
    public id: string
    public client: Socket 
    public me: {
      x: number
      y: number
      height: number
      score: number
      ready: boolean
    }
    public opponent: {
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
    public goal: boolean //= false

    constructor(client: Socket, id: string, position: number) {

        this.id = id
        this.client = client

        let player0 = {
            x: 79.6,
            y: 540,
            height: (1920 * 0.1),
            score: 0,
            ready: false
        }
        let player1 = {
            x: 1840.4,
            y: 540,
            height: (1920 * 0.1),
            score: 0,
            ready: false
        }

        if (position == 0) {
          this.me = player0
          this.opponent = player1
        }
        else {
          this.me = player1
          this.opponent = player0
        }

        this.ball = {
            x: (1920 / 2),
            y: (1080 / 2)
        }
        this.goal = false
    }
    
}