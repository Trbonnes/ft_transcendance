import { Injectable, NestMiddleware } from '@nestjs/common';

@Injectable()
export class AvatarMiddleware implements NestMiddleware {
  use(req: any, res: any, next: () => void) {
    next();
  }
}

let path = require('path')

//export const avatarFileName = (req, file, callback) => {
//  const name = file.originalname.split('.')[0]
//  const extension = path.extname(file.originalname)
//  const randomName = Array(2)
//    .fill(null)
//    .map(() => Math.round(Math.random() * 8).toString(8))
//    .join('')
//  callback(null, `${name}${randomName}${extension}`);
//};

export const avatarFileName = (req, file, callback) => {
  const name = file.originalname
  callback(null, `${name}`)
}