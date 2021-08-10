import Phaser from 'phaser'
import { config } from '../phaserconfig'
import { scenesList, activeScene, setActiveScene } from '../sceneManager'

import Button from '../objects/ButtonObject'


export default class chooseGameTypeWithFriendScene extends Phaser.Scene {
    private menu: Button[] = []

    constructor() {
        super('chooseGameTypeWithFriendScene')
    }

    init() {}

    preload() {}

    create() {
        setActiveScene(scenesList.MenuScene);

        this.add.text(config.width / 2, 120, "Play with a friend ?")
			.setFontSize(50)
			.setStroke('black', 3)
			.setTint(0x000000)
			.setOrigin(0.5, 0.5)

        this.menu.push(new Button(this, config.width / 2 - 300, config.height / 2, "Classic",
        function(Scene: Phaser.Scene) {
            Scene.scene.run(scenesList.LayoutScene, { type: scenesList.JoinGameScene })
            Scene.scene.stop(scenesList.MenuScene)
        }))

        this.menu.push(new Button(this, config.width / 2 + 300, config.height / 2, "Borderless",
        function(Scene: Phaser.Scene) {
            Scene.scene.run(scenesList.LayoutScene, { type: scenesList.JoinBorderlessScene })
            Scene.scene.stop(scenesList.MenuScene)
        }).setDisabled(true))
    }

    update(/*time, delta*/) {}
}