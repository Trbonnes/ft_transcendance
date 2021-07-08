import Phaser from 'phaser'
import { io, Socket } from 'socket.io-client'
import os from 'os'
import { config } from '../phaserconfig'
import { scenesList, activeScene, setActiveScene } from '../sceneManager'

export default class JoinBorderlesScene extends Phaser.Scene {
    private socket?: Socket
    private layoutType?: string

    constructor() {
        super('JoinBorderlesScene')
    }

    init(data: { layout: string }) {
        this.layoutType = data.layout
    }

    preload() {
        //console.log('join scene')
    }

    create() {
        setActiveScene(scenesList.JoinGameScene)

        console.log(this.layoutType)

        this.add.text(config.width / 2, 120, "Waiting for opponent...")
			.setFontSize(50)
			.setStroke('black', 3)
			.setTint(0x000000)
			.setOrigin(0.5, 0.5)

        this.add.video(config.width / 2, config.height / 2, 'loading.webm').play(true).setLoop()

        console.log(os.hostname())
        this.socket = io("http://" + os.hostname() + ":3000/borderless", {
            transportOptions: {
                cors : {
                    origin: '*'
                },
                transports: ['websockets']
            },
            query: { "spectate": "" },
        })

        this.socket.on('OpponentFound', (response: {player: number, room: string}) => {
            this.scene.run(scenesList.GameScene,  { socket: this.socket, player: response.player, room: response.room, layoutType: this.layoutType})
            this.scene.stop(this)
        })
    }

    update(/*time, delta*/) {
    }
}
