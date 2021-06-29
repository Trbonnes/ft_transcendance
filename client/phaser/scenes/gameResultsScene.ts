import Phaser from 'phaser'
import { config } from '../phaserconfig'
import { scenesList, activeScene, setActiveScene } from '../sceneManager'

import Button from '../objects/ButtonObject'

export default class GameResultsScene extends Phaser.Scene {
    private winner?: number //0->lost 1->won 2->Spectator
    private score?: { left: number, right: number }

    constructor() {
        super('GameResultsScene')
    }

    init(data: { win: number, score: { left: number, right: number } }) {
        this.winner = data.win
        this.score = data.score
    }

    preload() {
        //console.log('join scene')
    }

    create() {
        setActiveScene(scenesList.GameResultsScene)

        if (this.winner) {
            this.add.text(config.width / 2, 120, "You WIN !")
                .setFontSize(50)
                .setStroke('black', 3)
                .setTint(0x00ff00)
                .setOrigin(0.5, 0.5)
        }
        else if (!this.winner) {
            this.add.text(config.width / 2, 120, "You LOOSE !")
                .setFontSize(50)
                .setStroke('black', 3)
                .setTint(0xff0000)
                .setOrigin(0.5, 0.5)
        }
        this.add.text(config.width / 2, config.height / 2, this.score!.left.toString() + "  |  " + this.score!.right.toString()).setOrigin(0.5, 0.5).setTint(0x00ff00).setFontSize(60).setFontStyle('Bold')
        this.add.video(config.width / 2, 50, 'confetti.webm').play(true).setLoop()

        new Button(this, config.width / 2, 850, "Still\n    playing?",
        function(Scene: Phaser.Scene) {
            Scene.scene.run(scenesList.MenuScene)
            Scene.scene.stop(scenesList.GameResultsScene)
        })
    }

    update(/*time, delta*/) {
    }
}