import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { SocketIOAdapter } from './socketio.adapter'
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule,
    {
      cors : {
        origin: '*'
      }
  })
  app.enableCors();
  app.use(cookieParser());
  //app.useWebSocketAdapter(new SocketIOAdapter(app, []))
  //app.setGlobalPrefix('/api')
  await app.listen(3000)
}
bootstrap()
