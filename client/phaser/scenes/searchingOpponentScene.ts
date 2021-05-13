import Phaser from 'phaser'
import { config } from '../phaserconfig'
import { scenesList, activeScene, setActiveScene } from '../sceneManager'

import Button from '../objects/ButtonObject'


export default class SearchingOpponentScene extends Phaser.Scene {

    constructor() {
        super('SearchingOpponentScene')
    }

    init() {}

    preload() {
    }

    create() {
        setActiveScene(scenesList.SearchingOpponentScene);
    }

    update(/*time, delta*/) {}
}
