import Phaser from 'phaser'
import io from 'socket.io-client'
import { config } from '../phaserconfig'
import { scenesList, activeScene, setActiveScene } from '../sceneManager'

import Button from '../objects/ButtonObject'
import PongBar from '../objects/PongBar'
import Ball from '../objects/BallObject'


export default class GameScene extends Phaser.Scene {
    private socket?: SocketIOClient.Socket
    private player?: number
    private myBar?: PongBar
    private opponentBar?: PongBar
    private opponentUpdateY?: number
    private ball?: Ball

    constructor() {
        super('GameScene')
    }

    init(data: {
        socket: SocketIOClient.Socket
        player: number
    }) {
        this.socket = data.socket
        this.player = data.player
    }

    preload() {}

    create() {
        setActiveScene(scenesList.GameScene)
        this.input.setDefaultCursor('none') // Not forget to this.input.setDefaultCursor('default') when stopping the scene
        
        console.log(this.player)
        if(this.player == 0) {
            this.myBar = new PongBar(this)
            this.opponentBar = new PongBar(this, 1)
        }
        else {
            this.myBar = new PongBar(this, 1)
            this.opponentBar = new PongBar(this)
        }
        this.opponentUpdateY = this.opponentBar!.bar.y

        this.ball = new Ball(this)

        this.socket!.emit('JoinGame')
        
        this.socket!.on('OpponentMove', (data: number) => {
            this.opponentUpdateY = data
        })

        this.socket!.on('OpponentDisconnected', () => {
            this.socket!.disconnect()
            this.scene.run(scenesList.JoinGameScene)
            this.scene.stop(this)
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
