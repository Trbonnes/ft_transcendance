import Phaser from 'phaser'
import { config } from '../phaserconfig'
import { assetLoader } from '../assetsManager'
import { scenesList, sceneLoader } from '../sceneManager'


export class HomeScene extends Phaser.Scene {
  constructor() {
    super('HomeScene')
  }

  init() {}

  preload() {
    assetLoader(this)
    sceneLoader(this)
  }

  create() {
    this.add.image(config.width / 2, config.height / 2, 'background').setDisplaySize(config.width, config.height)
    this.scene.run(scenesList.MenuScene)
  }

  update(/*time, delta*/) {}
}
