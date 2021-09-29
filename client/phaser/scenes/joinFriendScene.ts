import Phaser from 'phaser'
import { io, Socket } from 'socket.io-client'
import os from 'os'
import { config } from '../phaserconfig'
import { scenesList, activeScene, setActiveScene } from '../sceneManager'
import createSocket from '../objects/CreateSocket'

import Button from '../objects/ButtonObject'
import Input from '../objects/InputField'
import ExitObject from '../objects/ExitObject'

export default class JoinFriendScene extends Phaser.Scene {
    private socket?: Socket
    private layoutType?: string
    private id?: string

    constructor() {
        super('JoinFriendScene')
    }

    init(data: { layout: string, id: string}) {
        this.layoutType = data.layout
        this.id = data.id
    }

    preload() {}

    create() {
        setActiveScene(scenesList.JoinFriendScene)

        this.add.text(config.width / 2, config.height / 2, "Game id: " + this.id)

        new Button(this, config.width / 2, 850, "Join",
        () => {
            this.establishConnection("game")
        })

        let exitButton = new ExitObject(this, 120, 120, "Exit", this.socket)
        exitButton.setDisplaySize(100, 100)
    }

    establishConnection(gateway: string) {

        this.socket = createSocket(gateway, "", this.id!)

        this.socket.on('OpponentFound', (response: {player: number, room: string}) => {
            this.scene.run(scenesList.GameScene,  { socket: this.socket, player: response.player, room: response.room, layoutType: this.layoutType})
            this.scene.stop(this)
        })

        this.socket?.on('Bad id', () => {
            if (gateway == "game")
                this.establishConnection("borderless")
            else {
                this.socket = undefined
                this.cameras.main.shake(400)
                this.add.text(config.width / 2, 250, "BAD ID")
                    .setFontSize(65)
                    .setStroke('black', 3)
                    .setTint(0xff0000)
                    .setOrigin(0.5, 0.5)
            }
        })

        this.socket.on('AlreadyConnected', () => {
            this.cameras.main.shake(400)
            this.add.text(config.width / 2, 600, "Error")
                .setFontSize(65)
                .setStroke('black', 3)
                .setTint(0xff0000)
                .setOrigin(0.5, 0.5)
        })

    }

    update(/*time, delta*/) {
    }
}