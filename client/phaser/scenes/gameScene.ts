import Phaser from 'phaser'
import { config } from '../phaserconfig'
import { scenesList, activeScene, setActiveScene } from '../sceneManager'

import Button from '../objects/ButtonObject'
import PongBar from '../objects/PongBar'


export default class GameScene extends Phaser.Scene {
    private leftBar?: PongBar
    private rightBar?: PongBar

    constructor() {
        super('GameScene')
    }

    init() {}

    preload() {
    }

    create() {
        setActiveScene(scenesList.GameScene);

        this.leftBar = new PongBar(this)
        this.rightBar = new PongBar(this, 1)
    }

    update(/*time, delta*/) {
        while (this.input.mousePointer.y > this.leftBar!.bar.y) {
            this.leftBar!.updatePosition(1)
        }
        while (this.input.mousePointer.y < this.leftBar!.bar.y) {
            this.leftBar!.updatePosition(-1)
        }
    }
}
