import Phaser from 'phaser'
import { config } from '../phaserconfig'

export default class Ball extends Phaser.GameObjects.GameObject {
	public ball: Phaser.GameObjects.Image

	constructor(
		scene: Phaser.Scene,
		style: string
	) {
		super(scene, 'Ball')

		this.ball = scene.add.image(config.width / 2, config.height / 2, style + '_ball.png').setOrigin(0.5, 0.5)
	}

	destroy() {
		this.ball.destroy()
	}

    updatePosition(deltaX: number, deltaY: number) {
      this.ball.x += deltaX
      this.ball.y += deltaY
    }
}
