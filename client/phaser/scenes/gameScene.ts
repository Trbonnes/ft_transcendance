import Phaser from 'phaser'
import { config } from '../phaserconfig'
import { scenesList, activeScene, setActiveScene } from '../sceneManager'

import Button from '../objects/ButtonObject'


export default class GameScene extends Phaser.Scene {

    constructor() {
        super('GameScene')
    }

    init() {}

    preload() {
    }

    create() {
        setActiveScene(scenesList.GameScene);
    }

    update(/*time, delta*/) {}
}
