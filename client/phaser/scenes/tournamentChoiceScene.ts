import Phaser from 'phaser'
import { config } from '../phaserconfig'
import { scenesList, activeScene, setActiveScene } from '../sceneManager'

import Button from '../objects/ButtonObject'


export default class TournamentChoiceScene extends Phaser.Scene {

    constructor() {
        super('TournamentChoiceScene')
    }

    init() {}

    preload() {
    }

    create() {
        setActiveScene(scenesList.TournamentChoiceScene);
    }

    update(/*time, delta*/) {}
}
