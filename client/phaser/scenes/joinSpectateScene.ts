import Phaser from 'phaser'
import { io, Socket } from 'socket.io-client'
import os from 'os'
import { config } from '../phaserconfig'
import { scenesList, activeScene, setActiveScene } from '../sceneManager'

import Button from '../objects/ButtonObject'
import Input from '../objects/InputField'

export default class JoinSpectateScene extends Phaser.Scene {
    private socket?: Socket
    private layoutType?: string

    constructor() {
        super('JoinSpectateScene')
    }

    init(data: { layout: string }) {
        this.layoutType = data.layout
    }

    preload() {}

    create() {
        setActiveScene(scenesList.JoinSpectateScene)

        const joinInput = new Input(this, config.width / 2, config.height / 2, {})
            .setPlaceholder('Enter Game ID')
            .setDisplaySize(560, 60)
            .setDisabled(false)

        this.game.domContainer.style.pointerEvents = 'all'

        console.log(joinInput.getNode())

        let badIdCount = 0;

        new Button(this, config.width / 2, 850, "Join",
        () => {
            console.log(joinInput.getValue())
            if (joinInput.getValue())
                this.establishConnection("game", joinInput.getValue())
        })
    }

    establishConnection(gateway: string, id: string) {

        console.log(os.hostname())
        this.socket = io("http://" + os.hostname() + ":3000/" + gateway, {
            transportOptions: {
                cors : {
                    origin: '*'
                },
                transports: ['websockets'],
            },
            query: { "spectate": id, "friend": "" },
        })

        this.socket?.on('Spectator Joined', (response: {room: string}) => {
            console.log('sectator joining')
            this.game.domContainer.style.pointerEvents = 'auto'
            this.scene.run(scenesList.SpectateScene,  { socket: this.socket, room: response.room, layoutType: this.layoutType})
            this.scene.stop(this)
        })

        this.socket?.on('Bad id', () => {
            if (gateway == "game")
                this.establishConnection("borderless", id)
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

    }

    update(/*time, delta*/) {
    }
}