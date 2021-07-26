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

    preload() {}

    create() {
        setActiveScene(scenesList.MenuScene);

        this.add.text(config.width / 2, 120, "Wanna play  some Pong ?")
			.setFontSize(50)
			.setStroke('black', 3)
			.setTint(0x000000)
			.setOrigin(0.5, 0.5)

        this.menu.push(new Button(this, config.width / 2 - 300, 400, "Classic",
        function(Scene: Phaser.Scene) {
            Scene.scene.run(scenesList.LayoutScene, { type: scenesList.JoinGameScene })
            Scene.scene.stop(scenesList.MenuScene)
        }))

        this.menu.push(new Button(this, config.width / 2 + 300, 400, "Borderless",
        function(Scene: Phaser.Scene) {
            Scene.scene.run(scenesList.LayoutScene, { type: scenesList.JoinBorderlessScene })
            Scene.scene.stop(scenesList.MenuScene)
        }))

        this.menu.push(new Button(this, config.width / 2 - 300, 800, "Spectate",
        function(Scene: Phaser.Scene) {
            Scene.scene.run(scenesList.LayoutScene, { type: scenesList.JoinSpectateScene })
            Scene.scene.stop(scenesList.MenuScene)
        }))

        this.menu.push(new Button(this, config.width / 2 + 300, 800, "  With\na friend",
        function(Scene: Phaser.Scene) {
            Scene.scene.run(scenesList.LayoutScene, { type: scenesList.JoinGameScene })
            Scene.scene.stop(scenesList.MenuScene)
        })
        .setDisabled(true))
    }

    update(/*time, delta*/) {}
}
