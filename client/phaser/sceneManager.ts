import Phaser from 'phaser'
import MenuScene from './scenes/menuScene'
import LayoutScene from './scenes/layoutScene'
import GameScene from './scenes/gameScene'
import JoinGameScene from './scenes/joinGameScene'
import GameResultsScene from './scenes/gameResultsScene'
import JoinSpectateScene from './scenes/joinSpectateScene'
import SpectateScene from './scenes/spectateScene'

export const scenesList = {
    HomeScene: 'HomeScene',
    MenuScene: 'MenuScene',
    LayoutScene: 'LayoutScene',
    GameScene: 'GameScene',
    JoinGameScene: 'JoinGameScene',
    GameResultsScene: 'GameResultsScene',
    JoinSpectateScene: 'JoinSpectateScene',
    SpectateScene: 'SpectateScene',
}

export var activeScene: string = scenesList.HomeScene
export function setActiveScene(scene: string) {
	activeScene = scene
}

export function sceneLoader(Scene: Phaser.Scene) {
    //GAME SCENES LOADER
    Scene.scene.add(scenesList.MenuScene, MenuScene, false)
    Scene.scene.add(scenesList.LayoutScene, LayoutScene, false)
    Scene.scene.add(scenesList.GameScene, GameScene, false)
    Scene.scene.add(scenesList.JoinGameScene, JoinGameScene, false)
    Scene.scene.add(scenesList.GameResultsScene, GameResultsScene, false)
    Scene.scene.add(scenesList.JoinSpectateScene, JoinSpectateScene, false)
    Scene.scene.add(scenesList.SpectateScene, SpectateScene, false)
}