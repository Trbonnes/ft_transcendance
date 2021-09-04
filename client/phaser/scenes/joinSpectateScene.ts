import Phaser from 'phaser'
import { io, Socket } from 'socket.io-client'
import os from 'os'
import { config } from '../phaserconfig'
import { scenesList, activeScene, setActiveScene } from '../sceneManager'
import createSocket from '../objects/CreateSocket'

import Button from '../objects/ButtonObject'
import Input from '../objects/InputField'
import ExitObject from '../objects/ExitObject'

export default class JoinSpectateScene extends Phaser.Scene {
    private socket?: Socket
    private layoutType?: string
    private id?: string

    constructor() {
        super('JoinSpectateScene')
    }

    init(data: { layout: string, id: string}) {
        this.layoutType = data.layout
        this.id = data.id
    }

    preload() {}

    create() {
        setActiveScene(scenesList.JoinSpectateScene)

        this.add.text(config.width / 2, config.height / 2, "Game id: " + this.id)

        // const joinInput = new Input(this, config.width / 2, config.height / 2, {}) //for test purpose only
        //     .setPlaceholder('Enter Game ID')
        //     .setDisplaySize(560, 60)
        //     .setDisabled(false)

        // this.game.domContainer.style.pointerEvents = 'all'

        // console.log(joinInput.getNode())

        new Button(this, config.width / 2, 850, "Join",
        () => {
            // console.log(joinInput.getValue())
            // if (joinInput.getValue()) {
            //     this.id = joinInput.getValue()
                this.establishConnection("game")
        })
    }

    establishConnection(gateway: string) {

        console.log(os.hostname())
        this.socket = createSocket(gateway, this.id!, "")

        this.socket?.on('Spectator Joined', (response: {room: string}) => {
            console.log('sectator joining')
            this.game.domContainer.style.pointerEvents = 'auto'
            this.scene.run(scenesList.SpectateScene,  { socket: this.socket, room: response.room, layoutType: this.layoutType})
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

        let exitButton = new ExitObject(this, 120, 120, "Exit", this.socket)
        exitButton.setDisplaySize(100, 100)

    }

    update(/*time, delta*/) {
    }
}