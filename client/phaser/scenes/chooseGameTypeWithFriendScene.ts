import Phaser from 'phaser'
import { config } from '../phaserconfig'
import { scenesList, activeScene, setActiveScene } from '../sceneManager'

import Button from '../objects/ButtonObject'
import ExitObject from '../objects/ExitObject'


export default class ChooseGameTypeWithFriendScene extends Phaser.Scene {
    private menu: Button[] = []

    constructor() {
        super('ChooseGameTypeWithFriendScene')
    }

    init() {}

    preload() {}

    create() {
        setActiveScene(scenesList.ChooseGameTypeWithFriendScene);

        this.add.text(config.width / 2, 120, "Play with a friend ?")
			.setFontSize(50)
			.setStroke('black', 3)
			.setTint(0x000000)
			.setOrigin(0.5, 0.5)

        this.menu.push(new Button(this, config.width / 2 - 300, config.height / 2, "Classic",
        function(Scene: Phaser.Scene) {
            Scene.scene.run(scenesList.LayoutScene, { type: scenesList.WaitingFriendScene })
            Scene.scene.stop(scenesList.ChooseGameTypeWithFriendScene)
        }))

        this.add.text(config.width / 2 - 300, config.height / 2 + 300,
        "↑\nA normal pong game\nwith a random adversary\nand a nice bouncing ball\nFirst at 6 points win")
        .setFontSize(38)
        .setTint(0x0000ff)
        .setOrigin(0.5, 0.5)
        .setAlign("center")

        this.menu.push(new Button(this, config.width / 2 + 300, config.height / 2, "Borderless",
        function(Scene: Phaser.Scene) {
            Scene.scene.run(scenesList.LayoutScene, { type: scenesList.WaitingBorderlessFriendScene })
            Scene.scene.stop(scenesList.ChooseGameTypeWithFriendScene)
        }))

        this.add.text(config.width / 2 + 350, config.height / 2 + 300,
        "↑\nPretty much the same\nexcept the ball does not\nbounces on walls\nit just teleport")
        .setFontSize(38)
        .setTint(0xff00ff)
        .setOrigin(0.5, 0.5)
        .setAlign("center")
        
        let exitButton = new ExitObject(this, 120, 120, "Exit", undefined)
        exitButton.setDisplaySize(100, 100)
    }

    update(/*time, delta*/) {}
}