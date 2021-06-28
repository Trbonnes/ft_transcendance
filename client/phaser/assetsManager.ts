import Phaser from 'phaser'
import { default as file } from '../static/assets/gameAssets.json'

export const assetsPath: string = "/assets/"


export function assetLoader(Scene: Phaser.Scene) {
  //WHOLE GAME IMAGES LOADER
  Scene.load.crossOrigin = 'true'
  Scene.load.path = assetsPath
  for (const [key, assets] of Object.entries(file)) {
    for (const [asset, img] of Object.entries(assets)) {
      if (asset == "path") {
        Scene.load.path = assetsPath + img
      }
      else {
        Scene.load.image(img, img)
      }
    }
  }
}