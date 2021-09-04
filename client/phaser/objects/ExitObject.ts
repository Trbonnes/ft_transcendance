import Phaser from 'phaser'
import { Socket } from 'socket.io-client'
import { scenesList, activeScene, setActiveScene } from '../sceneManager'

export default class ExitObject extends Phaser.GameObjects.GameObject {
	private btn: Phaser.GameObjects.Image
	private shadow?: Phaser.GameObjects.Image
	private text: Phaser.GameObjects.Text
	private disabled = false
	private socket: Socket | undefined

	constructor(
		scene: Phaser.Scene,
		x: number,
		y: number,
		text: string,
		socket: Socket | undefined,
		asset: string = "button.png",
		shadow = true
	) {
		super(scene, 'button')

		this.socket = socket

		if (shadow) {
			this.shadow = scene.add.image(x + 10, y + 10, asset)
				.setTint(0x000000)
			this.shadow.alpha = 0.6
		}

		this.btn = scene.add.image(x, y, asset)
			.setInteractive({ useHandCursor: true })
		this.text = scene.add.text(x, y, text)
			.setFontSize(30)
			.setTint(0xffffff)
			.setOrigin(0.5, 0.5)
            
		this.btn.on('pointerover', () => {
			if (!this.disabled)
				this.btn.setTint(0x00ff00)
		})

		this.btn.on('pointerout', () => {
			if (!this.disabled)
				this.btn.clearTint()
		})

		this.btn.on('pointerdown', () => {
			if (!this.disabled) {
                if (this.socket)
                    socket!.disconnect()
				scene.game.domContainer.style.pointerEvents = 'none'
                this.scene.scene.run(scenesList.MenuScene)
                this.scene.scene.stop(scene)
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
