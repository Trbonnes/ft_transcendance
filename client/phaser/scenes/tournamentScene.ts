import Phaser from 'phaser'
import { config } from '../phaserconfig'
import { scenesList, activeScene, setActiveScene } from '../sceneManager'

import Button from '../objects/ButtonObject'


export default class TournamentScene extends Phaser.Scene {

    constructor() {
        super('TournamentScene')
    }

    init() {}

    preload() {
    }

    create() {
        setActiveScene(scenesList.TournamentScene);
    }

    update(/*time, delta*/) {}
}
