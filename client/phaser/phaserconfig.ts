import Phaser, { Game, Loader } from 'phaser'
import VueRouter from 'vue-router'

import { scenesList, sceneLoader } from './sceneManager'
import { assetLoader } from './assetsManager'


export let router!: VueRouter

export const config: Phaser.Types.Core.GameConfig & {
	width: number
	height: number
} = {
	// https://photonstorm.github.io/phaser3-docs/Phaser.Core.Config.html https://rexrainbow.github.io/phaser3-rex-notes/docs/site/game/
	type: Phaser.WEBGL,
	parent: 'gameCtnr',
	width: 1920,
	height: 1080,
	customEnvironment: true,

	scale: {
		// https://rexrainbow.github.io/phaser3-rex-notes/docs/site/scalemanager/
		mode: Phaser.Scale.FIT,
		autoCenter: Phaser.Scale.CENTER_BOTH,
	},

	input: {
		keyboard: {
			target: window,
			// capture: [8],
		},
		mouse: {
			target: null,
			//capture: true,
		},
		activePointers: 1,
		touch: {
			target: null,
			capture: true,
		},
		smoothFactor: 0,
		gamepad: false,
		windowEvents: true,
	},
	disableContextMenu: false,

	backgroundColor: 0,

	render: {
		antialias: true,
		antialiasGL: true,
		mipmapFilter: 'LINEAR', // 'NEAREST', 'LINEAR', 'NEAREST_MIPMAP_NEAREST', 'LINEAR_MIPMAP_NEAREST', 'NEAREST_MIPMAP_LINEAR', 'LINEAR_MIPMAP_LINEAR'
		pixelArt: false,
		roundPixels: false,
		transparent: false,
		clearBeforeRender: false, // Whether the game canvas will be cleared between each rendering frame. You can disable this if you have a full-screen background image or game object.
		premultipliedAlpha: true,
		failIfMajorPerformanceCaveat: false,
		powerPreference: 'default', // 'high-performance', 'low-power' or 'default'
		batchSize: 4096,
		desynchronized: false,
	},

	physics: {
		default: 'false',
	},

	/*
	loader: {
        baseURL: '',
        path: 'http://xxx/assets/',
        maxParallelDownloads: undefined,
        crossOrigin: undefined,
        responseType: '',
        async: true,
        user: '',
        password: '',
        timeout: undefined
    },
    */

	/*
    images: {
        default: 'data:image/png;base64....',
        missing: 'data:image/png;base64....'
    },
    */

	dom: {
		createContainer: true, // Should the game create a div element to act as a DOM Container? Only enable if you're using DOM Element objects. You must provide a parent object if you use this feature.
		// behindCanvas: false,
	},

	callbacks: {
		postBoot: function(game) {
			game.domContainer.style.pointerEvents = 'none'
		}
	},

	plugins: {
		global: [
			//{key, plugin, start}
		],
		scene: [
			// ...
		],
	},

	fps: {
		min: 10,
		target: 60,
		forceSetTimeOut: false,
		deltaHistory: 10,
	},

	banner: {
		hidePhaser: false,
		text: '#ffffff',
		background: ['#ff0000', '#ffff00', '#00ff00', '#00ffff', '#000000'],
	},
}

export function setup(_options: {}): Phaser.Game {

	class HomeScene extends Phaser.Scene {
		constructor(Config: Phaser.Types.Scenes.SettingsConfig) {
			super(Config)
		}

    video?: Phaser.GameObjects.Video;

		init() {}

		preload() {
			sceneLoader(this)
			assetLoader(this)
		}

		async create() {
			// const me = userStore.user;

			this.add
					.image(config.width / 2, config.height / 2, "global_background.png")
					.setDisplaySize(config.width, config.height)

			//this.scene.run(scenesList.MenuScene)
			this.scene.run(scenesList.MenuScene)
    }

		update(/*time, delta*/) {}
	}

	const game = new Phaser.Game({ ...config, scene: HomeScene })
	return game
}
