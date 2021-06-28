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

        this.menu.push(new Button(this, config.width / 2 - 300, 400, "Classic Game",
        function(Scene: Phaser.Scene) {
            Scene.scene.run(scenesList.JoinGameScene)
            Scene.scene.stop(scenesList.LayoutScene)
        }))

        this.menu.push(new Button(this, config.width / 2 + 300, 400, "Borderless Game",
        function(Scene: Phaser.Scene) {
            Scene.scene.run(scenesList.JoinGameScene)
            Scene.scene.stop(scenesList.LayoutScene)
        }))

        this.menu.push(new Button(this, config.width / 2 - 300, 800, "Spectate",
        function(Scene: Phaser.Scene) {
            Scene.scene.run(scenesList.JoinGameScene)
            Scene.scene.stop(scenesList.LayoutScene)
        }))

        this.menu.push(new Button(this, config.width / 2 + 300, 800, "Play with\na friend",
        function(Scene: Phaser.Scene) {
            Scene.scene.run(scenesList.JoinGameScene)
            Scene.scene.stop(scenesList.LayoutScene)
        }))
    }

    update(/*time, delta*/) {}
}