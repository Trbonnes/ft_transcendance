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

        this.menu.push(new Button(this, config.width / 2 - 300, 400, "",
        function(Scene: Phaser.Scene) {
            Scene.scene.run(scenesList.JoinGameScene)
            Scene.scene.stop(scenesList.LayoutScene)
        }, "classical_layout.png"))

        this.menu.push(new Button(this, config.width / 2 + 300, 400, "",
        function(Scene: Phaser.Scene) {
            Scene.scene.run(scenesList.JoinGameScene)
            Scene.scene.stop(scenesList.LayoutScene)
        }, "maya_layout.png"))

        this.menu.push(new Button(this, config.width / 2 - 300, 800, "",
        function(Scene: Phaser.Scene) {
            Scene.scene.run(scenesList.JoinGameScene)
            Scene.scene.stop(scenesList.LayoutScene)
        }, "miku_layout.png"))

        this.menu.push(new Button(this, config.width / 2 + 300, 800, "",
        function(Scene: Phaser.Scene) {
            Scene.scene.run(scenesList.JoinGameScene)
            Scene.scene.stop(scenesList.LayoutScene)
        }, "football_layout.png"))
    }

    update(/*time, delta*/) {}
}