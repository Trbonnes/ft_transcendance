import Phaser, { Game, Loader } from 'phaser'
import VueRouter from 'vue-router'

import { scenesList, sceneLoader } from './sceneManager'
import { assetLoader } from './assetsManager'

export let router!: VueRouter

export let game!: Phaser.Game

export const config: Phaser.Types.Core.GameConfig & {
	width: number
	height: number
	invite: string | null
	spectate: string | null
	userId: string
	userToken: string
	store: any
	friendId : string
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

	invite: null,
	spectate: null,
	userId: "",
	userToken: "",
	store: null,
	friendId: ""
}

export function setup(_options: {
	userId: string,
	userToken: string,
	gameId: string,
	invite: string | null,
	spectate: string | null,
	store : any
	friendId : string}): Phaser.Game {

	class InGame extends Phaser.Scene {
		constructor(Config: Phaser.Types.Scenes.SettingsConfig) {
			super(Config)
		}

    video?: Phaser.GameObjects.Video;

		init() {}

		preload() {
			// sceneLoader(this)
			assetLoader(this)
		}

		async create() {

			this.add.image(config.width / 2, config.height / 2, "global_background.png")
					.setDisplaySize(config.width, config.height)

			this.add.text(config.width / 2, config.height / 2, "ALREADY IN GAME")
			.setFontSize(65)
			.setStroke('black', 3)
			.setTint(0xff0000)
			.setOrigin(0.5, 0.5)
    }

		update(/*time, delta*/) {}
	} 

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

			this.add.image(config.width / 2, config.height / 2, "global_background.png")
					.setDisplaySize(config.width, config.height)

			if(config.invite)
				this.scene.run(scenesList.JoinFriendScene, { type: "classical", id: config.invite })
			else if(config.friendId)
				this.scene.run(scenesList.ChooseGameTypeWithFriendScene)
			else if (config.spectate)
				this.scene.run(scenesList.JoinSpectateScene, { type: "classical", id: config.spectate })
			else
				this.scene.run(scenesList.MenuScene)
		
			this.game.events.on('pause', () => {
				console.log('pause')
			})
			this.game.events.on('resume', () => {
				console.log('resume')
			})
    	}

		update(/*time, delta*/) {}
	}

	config.invite = _options.invite
	config.spectate = _options.spectate
	config.userId = _options.userId
	config.userToken = _options.userToken
	config.store = _options.store
	config.friendId = _options.friendId


	if ((!game || !game.isRunning) && _options.gameId)
		game = new Phaser.Game({ ...config, scene: InGame,  })
	if (_options.spectate || _options.invite || _options.friendId) {
		if (game)
			game.destroy(true)
		game = new Phaser.Game({ ...config, scene: HomeScene,  })
	}
	else if (!game || !game.isRunning)
		game = new Phaser.Game({ ...config, scene: HomeScene,  })
	
	return game
}
