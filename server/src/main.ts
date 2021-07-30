import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SocketIOAdapter } from './socketio.adapter';
import * as cookieParser from 'cookie-parser';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: {
      origin: '*',
    },
  });
  app.useWebSocketAdapter(
    new SocketIOAdapter(app, ['http://localhost', 'http://e2r3p14.42.fr']),
  );
  app.useGlobalPipes(new ValidationPipe());
  app.enableCors();
  app.use(cookieParser());
  //app.setGlobalPrefix('/api')
  await app.listen(3000);
}
bootstrap();
