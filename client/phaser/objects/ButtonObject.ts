import Phaser from 'phaser'

export default class Button extends Phaser.GameObjects.GameObject {
	private btn: Phaser.GameObjects.Image
	private shadow?: Phaser.GameObjects.Image
	private text: Phaser.GameObjects.Text
	private disabled = false

	constructor(
		scene: Phaser.Scene,
		x: number,
		y: number,
		text: string,
		shadow = true
	) {
		super(scene, 'button')

		if (shadow) {
			this.shadow = scene.add
				.image(x + 10, y + 10, 'btn')
				.setTint(0x000000)
			this.shadow.alpha = 0.6
		}

		this.btn = scene.add.image(x, y, 'btn')
			.setInteractive({ useHandCursor: true })
		this.text = scene.add.text(x, y, text)
			.setFontSize(50)
			.setStroke('black', 3)
			.setTint(0x000000)
			.setOrigin(0.5, 0.5)
            
		this.btn.on('pointerover', () => {
			if (!this.disabled) {
				this.btn.setTint(0x00ff00)
				this.btn.setScale(1.2, 1.2)
				this.shadow?.setScale(1.2, 1.2)
				this.text.setScale(1.2, 1.2)
			}
			else {
			}
		})

		this.btn.on('pointerout', () => {
			if (!this.disabled) {
				this.btn.clearTint()
				this.btn.setScale(1, 1)
				this.shadow?.setScale(1, 1)
				this.text.setScale(1, 1)
			}
		})

		this.btn.on('pointerdown', () => {
			if (!this.disabled) {
					//Insert effect
			}
		})
	}

	destroy() {
		this.btn.destroy()
		this.text.destroy()
		this.shadow?.destroy()
	}

	setDisplaySize(x: number, y: number): this {
		this.btn.setDisplaySize(x, y)
		this.shadow?.setDisplaySize(x, y)
		return this
	}

	setDisabled(value: boolean): this {
		this.disabled = value
		if (value) this.btn.setTint(0x808080)
		else this.btn.clearTint()
		return this
	}

	isDisabled(): boolean {
		return this.disabled
	}

	setText(text: string): this {
		this.text.text = text
		return this
	}
}
