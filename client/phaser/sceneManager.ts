import Phaser from 'phaser'
import MenuScene from './scenes/menuScene'
import LayoutScene from './scenes/layoutScene'
import GameScene from './scenes/gameScene'
import JoinGameScene from './scenes/joinGameScene'
import JoinBorderlessScene from './scenes/joinBorderlessScene'
import GameResultsScene from './scenes/gameResultsScene'
import JoinSpectateScene from './scenes/joinSpectateScene'
import SpectateScene from './scenes/spectateScene'
import ChooseGameTypeWithFriendScene from './scenes/chooseGameTypeWithFriendScene'
import WaitingFriendScene from './scenes/waitingFriendScene'
import WaitingBorderlessFriendScene from './scenes/waitingBorderlessFriendScene'
import JoinFriendScene from './scenes/joinFriendScene'

export const scenesList = {
    HomeScene: 'HomeScene',
    MenuScene: 'MenuScene',
    LayoutScene: 'LayoutScene',
    GameScene: 'GameScene',
    JoinGameScene: 'JoinGameScene',
    JoinBorderlessScene: 'JoinBorderlessScene',
    GameResultsScene: 'GameResultsScene',
    JoinSpectateScene: 'JoinSpectateScene',
    SpectateScene: 'SpectateScene',
    ChooseGameTypeWithFriendScene: 'ChooseGameTypeWithFriendScene',
    WaitingFriendScene: 'WaitingFriendScene',
    WaitingBorderlessFriendScene: 'WaitingBorderlessFriendScene',
    JoinFriendScene: 'JoinFriendScene',

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
    Scene.scene.add(scenesList.JoinBorderlessScene, JoinBorderlessScene, false)
    Scene.scene.add(scenesList.GameResultsScene, GameResultsScene, false)
    Scene.scene.add(scenesList.JoinSpectateScene, JoinSpectateScene, false)
    Scene.scene.add(scenesList.SpectateScene, SpectateScene, false)
    Scene.scene.add(scenesList.ChooseGameTypeWithFriendScene, ChooseGameTypeWithFriendScene, false)
    Scene.scene.add(scenesList.WaitingFriendScene, WaitingFriendScene, false)
    Scene.scene.add(scenesList.WaitingBorderlessFriendScene, WaitingBorderlessFriendScene, false)
    Scene.scene.add(scenesList.JoinFriendScene, JoinFriendScene, false)
}