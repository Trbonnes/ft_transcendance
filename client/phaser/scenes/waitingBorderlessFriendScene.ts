import Phaser from 'phaser'
import { io, Socket } from 'socket.io-client'
import os from 'os'
import { config } from '../phaserconfig'
import { scenesList, activeScene, setActiveScene } from '../sceneManager'
import createSocket from '../objects/CreateSocket'

import CopyField from '../objects/CopyField'
import ExitObject from '../objects/ExitObject'
import Video from '../objects/VideoObject'

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

        console.log(this.layoutType)

        this.add.text(config.width / 2, 120, "Waiting for friend...")
			.setFontSize(50)
			.setStroke('black', 3)
			.setTint(0x000000)
			.setOrigin(0.5, 0.5)

        new Video(this, config.width / 2, config.height / 2, 'loading.webm')

        console.log(os.hostname())
        this.socket = createSocket("borderless", "", "true")

        this.socket.on('gameId', (response: string) => {
            gameLink = "/game?inviteId=" + response
            config.store.dispatch("directChannel/sendInvitation", {userId : config.friendId, content: gameLink})
        })

        this.socket.on('OpponentFound', (response: {player: number, room: string}) => {
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
