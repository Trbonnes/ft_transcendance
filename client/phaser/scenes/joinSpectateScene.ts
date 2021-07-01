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

    preload() {
        //console.log('join scene')
    }

    create() {
        setActiveScene(scenesList.JoinSpectateScene)

        const joinInput = new Input(this, config.width / 2, config.height / 2, {})
            .setPlaceholder('Game ID')
            .setDisplaySize(520, 40)

        new Button(this, config.width / 2, 850, "Join",
        (Scene: Phaser.Scene) => {
            if (joinInput.getValue()) {

                console.log(os.hostname())
                this.socket = io("http://" + os.hostname() + ":3000/game", {
                    transportOptions: {
                        cors : {
                            origin: '*'
                        },
                        transports: ['websockets'],
                    },
                    query: { "spectate": "true", "id": joinInput.getValue() },
                })

                this.socket.on('Spectator Joined', (response: {room: string}) => {
                    console.log('sectator joining')
                    // this.scene.run(scenesList.SpectateScene,  { socket: this.socket, room: response.room})
                    // this.scene.stop(this)
                })

                this.socket.on('Bad id', () => {
                    this.cameras.main.shake(400)
                    this.add.text(config.width / 2, 250, "BAD ID")
                        .setFontSize(65)
                        .setStroke('black', 3)
                        .setTint(0xff0000)
                        .setOrigin(0.5, 0.5)
                })
            }
        })
    }

    update(/*time, delta*/) {
    }
}