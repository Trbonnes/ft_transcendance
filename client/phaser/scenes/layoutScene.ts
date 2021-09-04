import Phaser from 'phaser'
import { config } from '../phaserconfig'
import { scenesList, activeScene, setActiveScene } from '../sceneManager'

import Button from '../objects/ButtonObject'
import ExitObject from '../objects/ExitObject'


export default class LayoutScene extends Phaser.Scene {
    private menu: Button[] = []
    private gameType: string = ""

    constructor() {
        super('LayoutScene')
    }

    init(data: { type: string }) {
        this.gameType = data.type
    }

    preload() {
    }

    create() {
        setActiveScene(scenesList.LayoutScene);

        this.add.text(config.width / 2, 120, "Choose a skin for your game:")
			.setFontSize(50)
			.setStroke('black', 3)
			.setTint(0x000000)
			.setOrigin(0.5, 0.5)

        this.menu.push(new Button(this, config.width / 2 - 300, 400, "",
        () => {
            this.scene.run(this.gameType, { layout: "classical" })
            this.scene.stop(scenesList.LayoutScene)
        }, "classical_layout.png"))

        this.menu.push(new Button(this, config.width / 2 + 300, 400, "",
        () => {
            this.scene.run(this.gameType, { layout: "maya" })
            this.scene.stop(scenesList.LayoutScene)
        }, "maya_layout.png"))

        this.menu.push(new Button(this, config.width / 2 - 300, 800, "",
        () => {
            this.scene.run(this.gameType, { layout: "miku" })
            this.scene.stop(scenesList.LayoutScene)
        }, "miku_layout.png"))

        this.menu.push(new Button(this, config.width / 2 + 300, 800, "",
        () => {
            this.scene.run(this.gameType, { layout: "football" })
            this.scene.stop(scenesList.LayoutScene)
        }, "football_layout.png"))

        let exitButton = new ExitObject(this, 120, 120, "Exit", undefined)
        exitButton.setDisplaySize(100, 100)
    }

    update(/*time, delta*/) {}
}