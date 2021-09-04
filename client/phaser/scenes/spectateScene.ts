import Phaser from 'phaser'
import { io, Socket } from 'socket.io-client'
import { config } from '../phaserconfig'
import { scenesList, activeScene, setActiveScene } from '../sceneManager'

import Button from '../objects/ButtonObject'
import PongBar from '../objects/PongBar'
import Ball from '../objects/BallObject'
import ExitObject from '../objects/ExitObject'


export default class SpectateScene extends Phaser.Scene {
    private layoutType?: string
    private socket?: Socket
    private room?: string
    private leftBar?: PongBar
    private rightBar?: PongBar
    private leftBarUpdate?: number
    private rightBarUpdate?: number
    private ball?: Ball
    private ballUpdate = {
        x: 0,
        y: 0,
        speed: 0
    }
    private score = {
        left: 0,
        right: 0
    }

    constructor() {
        super('SpectateScene')
        this.layoutType = 'classical'
    }

    init(data: {
        socket: Socket
        room: string
        layoutType: string
    }) {
        this.socket = data.socket
        this.room = data.room
        this.layoutType = data.layoutType
    }

    preload() {}

    create() {
        setActiveScene(scenesList.SpectateScene)
        // this.input.setDefaultCursor('none') // Not forget to this.input.setDefaultCursor('default') when stopping the scene
        
        this.add
        .image(config.width / 2, config.height / 2, this.layoutType + "_background.png")
        .setDisplaySize(config.width, config.height)

        let exitButton = new ExitObject(this, 120, 120, "Exit", this.socket)
        exitButton.setDisplaySize(100, 100)
        
        this.score = {
            left: 0,
            right: 0
        }

        let scoreBoard = this.add.text(config.width / 2, 50, this.score.left.toString() + "  |  " + this.score.right.toString()).setOrigin(0.5, 0.5).setTint(0x00ff00).setFontSize(60).setFontStyle('Bold')

        this.leftBar = new PongBar(this, this.layoutType!)
        this.rightBar = new PongBar(this, this.layoutType!, 1)
        this.leftBarUpdate = this.leftBar!.bar.y
        this.rightBarUpdate = this.rightBar!.bar.y

        this.ball = new Ball(this, this.layoutType!)
        
        this.socket!.on('BallMove', (data: {x:number, y:number}) => {
            this.ball!.ball.x = data.x
            this.ball!.ball.y = data.y
        })

        this.socket!.on('SpectatorMove', (data: { side: number, y: number }) => {
            if (data.side == 0)
                this.leftBarUpdate = data.y
            else
                this.rightBarUpdate = data.y
        })

        this.socket!.on('Goal', (data: {scoreP0: number, scoreP1: number}) => {
            this.score.left = data.scoreP0
            this.score.right = data.scoreP1
            scoreBoard.setText(this.score.left.toString() + "  |  " + this.score.right.toString())

            this.ball!.destroy()
            this.leftBar!.destroy()
            this.rightBar!.destroy()
            this.leftBar = new PongBar(this, this.layoutType!)
            this.rightBar = new PongBar(this, this.layoutType!, 1)
            this.leftBarUpdate = this.leftBar!.bar.y
            this.rightBarUpdate = this.rightBar!.bar.y
            this.ball = new Ball(this, this.layoutType!)
        })

        this.socket!.on('OpponentDisconnected', () => {
            this.ball!.destroy()
            this.leftBar!.destroy()
            this.rightBar!.destroy()
            scoreBoard.destroy()
            this.socket!.disconnect()
            this.input.setDefaultCursor('default')
            this.scene.run(scenesList.MenuScene)
            this.scene.stop(this)
        })

        this.socket!.on('End', (data: {scoreP0: number, scoreP1: number}) => {
            this.score.left = data.scoreP0
            this.score.right = data.scoreP1
            scoreBoard.setText(this.score.left.toString() + "  |  " + this.score.right.toString())

            this.ball!.destroy()
            this.leftBar!.destroy()
            this.rightBar!.destroy()
            scoreBoard.destroy()
            this.socket!.disconnect()
            this.input.setDefaultCursor('default')
            this.scene.run(scenesList.MenuScene)
            this.scene.stop(this)
        })
    }

    update(/*time, delta*/) {

        while (this.leftBarUpdate! > this.leftBar!.bar.y) {
            this.leftBar!.updatePosition(1)
        }
        while (this.leftBarUpdate! < this.leftBar!.bar.y) {
            this.leftBar!.updatePosition(-1)
        }

        while (this.rightBarUpdate! > this.rightBar!.bar.y) {
            this.rightBar!.updatePosition(1)
        }
        while (this.rightBarUpdate! < this.rightBar!.bar.y) {
            this.rightBar!.updatePosition(-1)
        }
    }
}
