import Phaser from 'phaser'
import { config } from '../phaserconfig'

export default class PongBar extends Phaser.GameObjects.GameObject {
	public bar: Phaser.GameObjects.Image
	private shadow?: Phaser.GameObjects.Image

	constructor(
		scene: Phaser.Scene,
		style: string,
        player = 0,
        y = config.height / 2,
		shadow = true
	) {
		super(scene, 'PongBar')

        if (!player) {
			if (shadow) {
				this.shadow = scene.add
					.image(79.6 + 10, y + 10, style + '_leftbar.png')
					.setTint(0x000000)
					.setOrigin(1, 0.5)
				this.shadow.alpha = 0.6
			}
	
			this.bar = scene.add.image(79.6, y, style + '_leftbar.png').setOrigin(1, 0.5)
        }
        else {
			if (shadow) {
				this.shadow = scene.add
					.image(1840.4 + 10, y + 10, style + '_rightbar.png')
					.setTint(0x000000)
					.setOrigin(0, 0.5)
				this.shadow.alpha = 0.6
			}
	
			this.bar = scene.add.image(1840.4, y, style + '_rightbar.png').setOrigin(0, 0.5)
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
