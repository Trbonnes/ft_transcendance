import Phaser from 'phaser'
import { config } from '../phaserconfig'
import { scenesList, activeScene, setActiveScene } from '../sceneManager'

import Button from '../objects/ButtonObject'


export default class LayoutScene extends Phaser.Scene {
    private menu: Button[] = []

    constructor() {
        super('LayoutScene')
    }

    init() {}

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
        function(Scene: Phaser.Scene) {
            Scene.scene.run(scenesList.JoinGameScene, { layout: "classical" })
            Scene.scene.stop(scenesList.LayoutScene)
        }, "classical_layout.png"))

        this.menu.push(new Button(this, config.width / 2 + 300, 400, "",
        function(Scene: Phaser.Scene) {
            Scene.scene.run(scenesList.JoinGameScene, { layout: "maya" })
            Scene.scene.stop(scenesList.LayoutScene)
        }, "maya_layout.png"))

        this.menu.push(new Button(this, config.width / 2 - 300, 800, "",
        function(Scene: Phaser.Scene) {
            Scene.scene.run(scenesList.JoinGameScene, { layout: "miku" })
            Scene.scene.stop(scenesList.LayoutScene)
        }, "miku_layout.png"))

        this.menu.push(new Button(this, config.width / 2 + 300, 800, "",
        function(Scene: Phaser.Scene) {
            Scene.scene.run(scenesList.JoinGameScene, { layout: "football" })
            Scene.scene.stop(scenesList.LayoutScene)
        }, "football_layout.png"))
    }

    update(/*time, delta*/) {}
}