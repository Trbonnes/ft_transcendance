import Phaser from 'phaser'

export const scenesList = {
	HomeScene: 'HomeScene',
}

export var activeScene: string = scenesList.HomeScene
export function setActiveScene(scene: string) {
	activeScene = scene
}

export function sceneLoader(Scene: Phaser.Scene) {
    //GAME SCENES LOADER in alphabetical order
    //Scene.scene.add(scenesList., , false)
}