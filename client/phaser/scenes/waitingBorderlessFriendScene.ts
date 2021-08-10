import Phaser from 'phaser'
import { io, Socket } from 'socket.io-client'
import os from 'os'
import { config } from '../phaserconfig'
import { scenesList, activeScene, setActiveScene } from '../sceneManager'

import CopyField from '../objects/CopyField'

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

        this.game.domContainer.style.pointerEvents = 'all'

        console.log(this.layoutType)

        this.add.text(config.width / 2, 120, "Waiting for friend...")
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
            query: { "spectate": "", "friend": "true" },
        })

        this.socket.on('gameId', (response: string) => {
            gameLink = "http://localhost/game/" + response
            copyField = new CopyField(
                this,
                config.width / 2,
                config.height / 2 + 250,
                gameLink,
                {
                    'text-align': 'center',
                    'font-size': '20px',
                }
            ).setDisplaySize(700, 40)
        })

        this.socket.on('OpponentFound', (response: {player: number, room: string}) => {
            this.game.domContainer.style.pointerEvents = 'auto'
            this.scene.run(scenesList.GameScene,  { socket: this.socket, player: response.player, room: response.room, layoutType: this.layoutType})
            this.scene.stop(this)
        })
    }

    update(/*time, delta*/) {
    }
}
