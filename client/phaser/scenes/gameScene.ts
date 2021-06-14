import Phaser from 'phaser'
import io from 'socket.io-client'
import { config } from '../phaserconfig'
import { scenesList, activeScene, setActiveScene } from '../sceneManager'

import Button from '../objects/ButtonObject'
import PongBar from '../objects/PongBar'
import Ball from '../objects/BallObject'


export default class GameScene extends Phaser.Scene {
    private socket?: SocketIOClient.Socket
    private myBar?: PongBar
    private opponentBar?: PongBar
    private opponentUpdateY?: number
    private ball?: Ball
    private player?: boolean

    constructor() {
        super('GameScene')
    }

    init(data: {
        socket: SocketIOClient.Socket
        player: boolean
    }) {
        this.socket = data.socket
        this.player = data.player
    }

    preload() {}

    create() {
        setActiveScene(scenesList.GameScene)
        this.input.setDefaultCursor('none') // Not forget to this.input.setDefaultCursor('default') when stopping the scene
        if (this.player) {
            this.myBar = new PongBar(this, 1)
            this.opponentBar = new PongBar(this)
        }
        else {
            this.myBar = new PongBar(this)
            this.opponentBar = new PongBar(this, 1)
        }
        this.opponentUpdateY = this.opponentBar!.bar.y

        this.ball = new Ball(this)
        
        this.socket!.on('OpponentMove', (data: number) => {
            this.opponentUpdateY = data
        })
    }

    update(/*time, delta*/) {
        while (this.input.mousePointer.y > this.myBar!.bar.y) {
            this.myBar!.updatePosition(1)
            this.socket!.emit('MoveBar', this.myBar!.bar.y)
        }
        while (this.input.mousePointer.y < this.myBar!.bar.y) {
            this.myBar!.updatePosition(-1)
            this.socket!.emit('MoveBar', this.myBar!.bar.y)
        }

        while (this.opponentUpdateY! > this.opponentBar!.bar.y) {
            this.opponentBar!.updatePosition(1)
        }
        while (this.opponentUpdateY! < this.opponentBar!.bar.y) {
            this.opponentBar!.updatePosition(-1)
        }

    }
}
