import Phaser from 'phaser'
import { config } from '../phaserconfig'

export default class PongBar extends Phaser.GameObjects.GameObject {
	public bar: Phaser.GameObjects.Image
	private shadow?: Phaser.GameObjects.Image

	constructor(
		scene: Phaser.Scene,
        player = 0,
        y = config.height / 2,
		shadow = true
	) {
		super(scene, 'PongBar')

		if (shadow) {
			this.shadow = scene.add
				.image(0 + 10, y + 10, 'pongBar')
				.setTint(0x000000)
                .setScale(0.2, 0.2)
			this.shadow.alpha = 0.6
		}

		this.bar = scene.add.image(0, y, 'pongBar')
            .setInteractive({ useHandCursor: true })
            .setScale(0.2, 0.2)

        if (player) {
            this.bar.flipX = true
            this.shadow!.flipX = true
            this.bar.x = config.width - this.bar.width * 0.2
            this.shadow!.x = config.width - this.shadow!.width * 0.2
        }
        else {
            this.bar.x = this.bar.width * 0.2
            this.shadow!.x = this.shadow!.width * 0.2
        }
	}

	destroy() {
		this.bar.destroy()
		this.shadow?.destroy()
	}

	setDisplaySize(x: number, y: number): this {
		this.bar.setDisplaySize(x, y)
		this.shadow?.setDisplaySize(x, y)
		return this
	}

    updatePosition(delta: number) {
        this.bar.y += delta
        this.shadow!.y += delta
    }
}
