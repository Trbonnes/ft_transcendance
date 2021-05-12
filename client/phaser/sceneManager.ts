import Phaser from 'phaser'
import MenuScene from './scenes/menuScene'

export const scenesList = {
    HomeScene: 'HomeScene',
    MenuScene: 'MenuScene',
}

export var activeScene: string = scenesList.HomeScene
export function setActiveScene(scene: string) {
	activeScene = scene
}

export function sceneLoader(Scene: Phaser.Scene) {
    //GAME SCENES LOADER in alphabetical order
    Scene.scene.add(scenesList.MenuScene, MenuScene, false)
}