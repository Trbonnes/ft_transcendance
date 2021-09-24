import Phaser from 'phaser'
import { config } from '../phaserconfig'

export default class VideoObject extends Phaser.GameObjects.GameObject {
	public video: Phaser.GameObjects.Video

	constructor(
		scene: Phaser.Scene,
        x: number,
        y: number,
		videoId: string,
	) {
		super(scene, 'PongBar')

        this.video = scene.add.video(x, y, videoId)
        .play(true)
        .setLoop()

        scene.game.events.on('resume', () => {
            this.video.setPaused(false)
        })
	}

	destroy() {
		this.video.destroy()
	}
}
