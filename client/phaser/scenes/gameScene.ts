import Phaser from 'phaser'
import { io, Socket } from 'socket.io-client'
import { config } from '../phaserconfig'
import { scenesList, activeScene, setActiveScene } from '../sceneManager'

import Button from '../objects/ButtonObject'
import PongBar from '../objects/PongBar'
import Ball from '../objects/BallObject'
import GameState from '../objects/GameState.class'


export default class GameScene extends Phaser.Scene {
    private gameState?: GameState
    private player?: number
    private myBar?: PongBar
    private opponentBar?: PongBar
    private ball?: Ball


    constructor() {
        super('GameScene')
    }

    init(data: {
        socket: Socket
        player: number
        room: string
    }) {
        this.gameState = new GameState(data.socket, data.room, data.player)
        this.player = this.player
    }

    preload() {}

    create() {
        setActiveScene(scenesList.GameScene)
        this.input.setDefaultCursor('none') // Not forget to this.input.setDefaultCursor('default') when stopping the scene
        
        //console.log('player num: ', this.player)
        //console.log('client side room id: ', this.gameState!.id)

        let scoreBoard: Phaser.GameObjects.Text

        if (this.player == 0) {
            this.myBar = new PongBar(this)
            this.opponentBar = new PongBar(this, 1)
            scoreBoard = this.add.text(config.width / 2, 50, this.gameState!.me.score.toString() + "  |  " + this.gameState!.opponent.score.toString()).setOrigin(0.5, 0.5).setTint(0x00ff00).setFontSize(60).setFontStyle('Bold')
        }
        else {
            this.myBar = new PongBar(this, 1)
            this.opponentBar = new PongBar(this)
            scoreBoard = this.add.text(config.width / 2, 50, this.gameState!.opponent.score.toString() + "  |  " + this.gameState!.me.score.toString()).setOrigin(0.5, 0.5).setTint(0x00ff00).setFontSize(60).setFontStyle('Bold')
        }

        this.ball = new Ball(this)

        this.gameState!.client.emit('JoinGame', this.gameState!.id)
        
        this.gameState!.client.on('MoveBall', (data: {x:number, y:number}) => {
            this.ball!.ball.x = data.x
            this.ball!.ball.y = data.y
        })

        this.gameState!.client.on('OpponentMove', (data: number) => {
            this.gameState!.opponent.y = data
        })

        this.gameState!.client.on('Goal', (data: {scoreP0: number, scoreP1: number}) => {
            scoreBoard.setText(data.scoreP0.toString() + "  |  " + data.scoreP1.toString())

            this.ball!.destroy()
            this.ball = new Ball(this)
        }) 

        this.gameState!.client.on('OpponentDisconnected', () => {
            this.ball!.destroy()
            this.myBar!.destroy()
            this.opponentBar!.destroy()
            this.gameState!.client.disconnect()
            this.scene.run(scenesList.JoinGameScene)
            this.scene.stop(this)
        })
    }

    update(time: number, delta: number) {

        console.log(delta)

        while (this.input.mousePointer.y > this.myBar!.bar.y) {
            this.myBar!.updatePosition(1)
            this.gameState!.client.emit('MoveBar', {id: this.gameState!.id, y: this.myBar!.bar.y})
        }
        while (this.input.mousePointer.y < this.myBar!.bar.y) {
            this.myBar!.updatePosition(-1)
            this.gameState!.client.emit('MoveBar', {id: this.gameState!.id, y: this.myBar!.bar.y})
        }

        while (this.gameState!.opponent.y! > this.opponentBar!.bar.y) {
            this.opponentBar!.updatePosition(1)
        }
        while (this.gameState!.opponent.y! < this.opponentBar!.bar.y) {
            this.opponentBar!.updatePosition(-1)
        }

    }
}
