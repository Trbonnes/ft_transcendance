import Phaser from 'phaser'
import io from 'socket.io-client'
import os from 'os'
import { config } from '../phaserconfig'
import { scenesList, activeScene, setActiveScene } from '../sceneManager'

export default class JoinGameScene extends Phaser.Scene {
    private socket?: SocketIOClient.Socket
    private player?: boolean

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
          })
        this.socket.emit('JoinGame', (response: boolean) => {
            this.player = response
        })
        this.socket.on('OpponentFound', () => {
            this.scene.run(scenesList.GameScene,  { socket: this.socket, player: this.player })
            this.scene.stop(this)
        })
    }

    update(/*time, delta*/) {
    }
}
