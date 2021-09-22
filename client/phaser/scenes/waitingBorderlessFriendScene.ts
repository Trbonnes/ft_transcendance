import Phaser from 'phaser'
import { io, Socket } from 'socket.io-client'
import os from 'os'
import { config } from '../phaserconfig'
import { scenesList, activeScene, setActiveScene } from '../sceneManager'
import createSocket from '../objects/CreateSocket'

import CopyField from '../objects/CopyField'
import ExitObject from '../objects/ExitObject'

export default class WaitingBorderlessFriendScene extends Phaser.Scene {
    private socket?: Socket
    private layoutType?: string

    constructor() {
        super('WaitingBorderlessFriendScene')
    }

    init(data: { layout: string }) {
        this.layoutType = data.layout
    }

    preload() {}

    create() {
        setActiveScene(scenesList.WaitingFriendScene)

        let gameLink: string
        let copyField: CopyField

        // this.game.domContainer.style.pointerEvents = 'all'

        console.log(this.layoutType)

        this.add.text(config.width / 2, 120, "Waiting for friend...")
			.setFontSize(50)
			.setStroke('black', 3)
			.setTint(0x000000)
			.setOrigin(0.5, 0.5)

        this.add.video(config.width / 2, config.height / 2, 'loading.webm').play(true).setLoop()

        console.log(os.hostname())
        this.socket = createSocket("borderless", "", "true")

        this.socket.on('gameId', (response: string) => {
            gameLink = "http://localhost/game/" + response
            // copyField = new CopyField(
            //     this,
            //     config.width / 2,
            //     config.height / 2 + 250,
            //     gameLink,
            //     {
            //         'text-align': 'center',
            //         'font-size': '20px',
            //     }
            // ).setDisplaySize(700, 40)
            config.store.dispatch("directChannel/sendMessage", {userId : "", content: gameLink})
        })

        this.socket.on('OpponentFound', (response: {player: number, room: string}) => {
            this.game.domContainer.style.pointerEvents = 'auto'
            this.scene.run(scenesList.GameScene,  { socket: this.socket, player: response.player, room: response.room, layoutType: this.layoutType})
            this.scene.stop(this)
        })

        this.socket.on('AlreadyConnected', () => {
            this.cameras.main.shake(400)
            this.add.text(config.width / 2, 800, "Error")
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
