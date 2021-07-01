import Phaser from 'phaser'

export default class Input extends Phaser.GameObjects.DOMElement {
	private shadow?: Phaser.GameObjects.Image

	constructor(
		scene: Phaser.Scene,
		x: number,
		y: number,
		style?: any,
		shadow = true
	) {
		super(scene, x, y, 'input', style)

		scene.add.existing(this)

		if (shadow) {
			this.shadow = scene.add
				.image(x + 10, y + 10, 'menu_button')
				.setTint(0x000000)
			this.shadow.alpha = 0.6
		}
	}

	setDisplaySize(x: number, y: number): this {
		if (this.shadow) this.shadow.setDisplaySize(x, y)

		this.getNode().style.width = x + 'px'
		this.getNode().style.height = y + 'px'

		this.updateSize()

		return this
	}

	getNode(): HTMLInputElement {
		return this.node as HTMLInputElement
	}

	setPlaceholder(placeholder: string): this {
		this.getNode().placeholder = placeholder
		return this
	}

	setValue(value: string): this {
		this.getNode().value = value
		return this
	}

	getValue(): string {
		return this.getNode().value
	}

	setDisabled(value: boolean): this {
		this.getNode().disabled = value
		return this
	}
}
