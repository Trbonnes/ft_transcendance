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

        this.menu.push(new Button(this, 300, 400, "Matchmaking"))
        this.menu.push(new Button(this, config.width / 2, 400, "Tournament"))
        this.menu.push(new Button(this, config.width - 300, 400, "War").setDisabled(true))
        this.menu.push(new Button(this, config.width / 2 - 300, 800, "Spectate"))
        this.menu.push(new Button(this, config.width / 2 + 300, 800, "Play with\na friend"))
    }

    update(/*time, delta*/) {}
}
