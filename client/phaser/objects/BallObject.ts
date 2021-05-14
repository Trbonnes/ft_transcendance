import Phaser from 'phaser'
import { config } from '../phaserconfig'

export default class Ball extends Phaser.GameObjects.GameObject {
	public ball: Phaser.GameObjects.Image

	constructor(
		scene: Phaser.Scene,
	) {
		super(scene, 'Ball')

		this.ball = scene.add.image(config.width / 2, config.height / 2, 'ball')
	}

	destroy() {
		this.ball.destroy()
	}

	setDisplaySize(x: number, y: number): this {
		this.ball.setDisplaySize(x, y)
		return this
	}

    updatePosition(deltaX: number, deltaY: number) {
      this.ball.x += deltaX
      this.ball.y += deltaY
    }
}
