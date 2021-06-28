import Phaser from 'phaser'
import MenuScene from './scenes/menuScene'
import LayoutScene from './scenes/layoutScene'
import GameScene from './scenes/gameScene'
import JoinGameScene from './scenes/joinGameScene'

export const scenesList = {
    HomeScene: 'HomeScene',
    MenuScene: 'MenuScene',
    LayoutScene: 'LayoutScene',
    GameScene: 'GameScene',
    JoinGameScene: 'JoinGameScene',
}

export var activeScene: string = scenesList.HomeScene
export function setActiveScene(scene: string) {
	activeScene = scene
}

export function sceneLoader(Scene: Phaser.Scene) {
    //GAME SCENES LOADER
    console.log('tritan ile tro for')
    Scene.scene.add(scenesList.MenuScene, MenuScene, false)
    Scene.scene.add(scenesList.LayoutScene, LayoutScene, false)
    Scene.scene.add(scenesList.GameScene, GameScene, false)
    Scene.scene.add(scenesList.JoinGameScene, JoinGameScene, false)
}