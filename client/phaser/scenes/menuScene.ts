import Phaser from 'phaser'
import { config } from '../phaserconfig'
import { scenesList, activeScene, setActiveScene } from '../sceneManager'

import Button from '../objects/ButtonObject'


export default class MenuScene extends Phaser.Scene {
    private menu: Button[] = []

    constructor() {
        super('MenuScene')
    }

    init() {}

    preload() {
    }

    create() {
        setActiveScene(scenesList.MenuScene);

        this.menu.push(new Button(this, 500, 500, "Matchmaking"))
    }

    update(/*time, delta*/) {}
}
