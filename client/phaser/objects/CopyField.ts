import Phaser, { GameObjects } from 'phaser'

export default class CopyField extends GameObjects.Container {
	private timeoutId?: any
	private listener: () => void
	private shadow?: Phaser.GameObjects.Image

	private domEl: GameObjects.DOMElement

	constructor(
		scene: Phaser.Scene,
		x: number,
		y: number,
		private value: string,
		style?: any,
		shadow = true
	) {
		super(scene, x, y)

		scene.add.existing(this)

		this.domEl = scene.add.dom(0, 0, 'div', style)
		this.add(this.domEl)

		this.getNode().appendChild(document.createElement('input'))

		this.domEl.setClassName('copy-field')

		const styleObj = this.getInputNode().style
		styleObj.color = 'black'

		this.getInputNode().value = this.value

		this.domEl.addListener('click')
		this.listener = () => {
			this.copy()

			this.getInputNode().value = 'Copié !'
			this.getInputNode().style.color = 'green'

			this.timeoutId = setTimeout(() => {
				this.getInputNode().value = this.value
				this.getInputNode().style.color = 'black'
				this.timeoutId = undefined
			}, 1000)
		}
		this.domEl.on('click', this.listener)

		this.setDisabled(true)

		if (shadow) {
			this.shadow = scene.add
				.image(x + 10, y + 10, 'menu_button')
				.setTint(0x000000)
			this.shadow.alpha = 0.6
			this.add(this.shadow)
		}
	}

	preDestroy() {
		this.domEl.off('click', this.listener)
		this.removeListener('click')

		if (this.timeoutId) clearTimeout(this.timeoutId)
		super.preDestroy()
	}

	setDisplaySize(x: number, y: number): this {
		if (this.shadow) this.shadow.setDisplaySize(x, y)

		this.getNode().style.width = x + 'px'
		this.getNode().style.height = y + 'px'

		this.domEl.updateSize()

		return this
	}

	setValue(value: string) {
		this.value = value
		if (this.timeoutId) clearTimeout(this.timeoutId)
		this.getInputNode().value = value
	}

	getNode(): HTMLInputElement {
		return this.domEl.node as HTMLInputElement
	}

	getInputNode(): HTMLInputElement {
		return this.domEl.node.children[0] as HTMLInputElement
	}

	setPlaceholder(placeholder: string): this {
		this.getInputNode().placeholder = placeholder
		return this
	}

	setDisabled(value: boolean): this {
		this.getInputNode().disabled = value
		return this
	}

	copy() {
		this.getInputNode().disabled = false
		this.getInputNode().focus()
		this.getInputNode().select()
		document.execCommand('copy')
		this.getInputNode().disabled = true
	}
}
