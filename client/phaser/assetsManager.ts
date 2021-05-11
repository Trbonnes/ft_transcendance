import Phaser from 'phaser'
import { default as file } from '../static/assets/assets.json'

export const assetsPath: string = "/assets/"

// export var spritesheet: any = {
// 	sheetLength: 0,
// 	sheetHeight: 0,
// 	spriteLength: 0,
// 	spriteHeight: 0,
// }

export function assetLoader(Scene: Phaser.Scene) {
  //WHOLE GAME IMAGES LOADER
  Scene.load.crossOrigin = 'true'
  Scene.load.path = assetsPath
  for (const [key, assets] of Object.entries(file)) {
        Scene.load.image(key, assets)
  }
}