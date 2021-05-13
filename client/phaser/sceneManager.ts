import Phaser from 'phaser'
import MenuScene from './scenes/menuScene'
import GameScene from './scenes/gameScene'
import SearchingOpponentScene from './scenes/searchingOpponentScene'
import TournamentChoiceScene from './scenes/tournamentChoiceScene'
import TournamentScene from './scenes/tournamentScene'

export const scenesList = {
    HomeScene: 'HomeScene',
    MenuScene: 'MenuScene',
    GameScene: 'GameScene',
    SearchingOpponentScene: 'SearchingOpponentScene',
    TournamentChoiceScene: 'TournamentChoiceScene',
    TournamentScene: 'TournamentScene',
}

export var activeScene: string = scenesList.HomeScene
export function setActiveScene(scene: string) {
	activeScene = scene
}

export function sceneLoader(Scene: Phaser.Scene) {
    //GAME SCENES LOADER
    Scene.scene.add(scenesList.MenuScene, MenuScene, false)
    Scene.scene.add(scenesList.GameScene, GameScene, false)
    Scene.scene.add(scenesList.SearchingOpponentScene, SearchingOpponentScene, false)
    Scene.scene.add(scenesList.TournamentChoiceScene, TournamentChoiceScene, false)
    Scene.scene.add(scenesList.TournamentScene, TournamentScene, false)
}