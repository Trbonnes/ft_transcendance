import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { SocketIOAdapter } from './socketio.adapter'

async function bootstrap() {
  const app = await NestFactory.create(AppModule,
    {
      cors : {
        origin: '*'
      }
  })
  app.enableCors()
  app.useWebSocketAdapter(new SocketIOAdapter(app, ['http://localhost', 'http://e2r3p14.42.fr']))
  //app.setGlobalPrefix('/api')
  await app.listen(3000)
}
bootstrap()
