import Phaser from 'phaser'
import io from 'socket.io-client'
import { config } from '../phaserconfig'
import { scenesList, activeScene, setActiveScene } from '../sceneManager'

import Button from '../objects/ButtonObject'
import PongBar from '../objects/PongBar'
import Ball from '../objects/BallObject'


export default class GameScene extends Phaser.Scene {
    private socket?: SocketIOClient.Socket
    private leftBar?: PongBar
    private rightBar?: PongBar
    private ball?: Ball

    constructor() {
        super('GameScene')
    }

    init() {}

    preload() {
    }

    create() {
        setActiveScene(scenesList.GameScene)
        this.socket = io("http://localhost:3000/game", {
            transportOptions: {
                cors : true
            }
          })
        //this.socket.emit('game')
        this.input.setDefaultCursor('none') // Not forget to this.input.setDefaultCursor('default') when stopping the scene
        this.leftBar = new PongBar(this)
        this.rightBar = new PongBar(this, 1)
        this.ball = new Ball(this)
    }

    update(/*time, delta*/) {
        while (this.input.mousePointer.y > this.leftBar!.bar.y) {
            this.leftBar!.updatePosition(1)
            //send the position to the server
        }
        while (this.input.mousePointer.y < this.leftBar!.bar.y) {
            this.leftBar!.updatePosition(-1)
            //send the position to the server
        }

        //receive the ball position from the server and update it on screen
        /*
        while (this.ball!.ball.x > Server.ball.x) {
            this.ball!.updatePosition(-1, 0)
        }
        while (this.ball!.ball.x < Server.ball.x) {
            this.ball!.updatePosition(1, 0)
        }
        while (this.ball!.ball.y > Server.ball.y) {
            this.ball!.updatePosition(0, -1)
        }
        while (this.ball!.ball.y < Server.ball.y) {
            this.ball!.updatePosition(0, 1)
        }
        */
    }
}
