import Phaser from 'phaser'
import { io, Socket } from 'socket.io-client'
import os from 'os'
import { config } from '../phaserconfig'
import { scenesList, activeScene, setActiveScene } from '../sceneManager'

export default class JoinGameScene extends Phaser.Scene {
    private socket?: Socket

    constructor() {
        super('JoinGameScene')
    }

    init() {}

    preload() {
        //console.log('join scene')
    }

    create() {
        setActiveScene(scenesList.JoinGameScene)
        console.log(os.hostname())
        this.socket = io("http://" + os.hostname() + ":3000/game", {
            transportOptions: {
                cors : {
                    origin: '*'
                },
                transports: ['websockets']
            }
        },)

        this.socket.on('OpponentFound', (response: {player: number, room: string}) => {
            this.scene.run(scenesList.GameScene,  { socket: this.socket, player: response.player, room: response.room})
            this.scene.stop(this)
        })
    }

    update(/*time, delta*/) {
    }
}
