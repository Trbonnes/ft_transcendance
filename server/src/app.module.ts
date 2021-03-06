import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import * as Joi from '@hapi/joi';
import { configService } from './config/config.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ChatModule } from './chat/chat.module';
import { GameGateway } from './app.gamegateway';
import { BorderlessGateway } from './app.borderlessgateway';
import { FriendsModule } from './friends/friends.module';
import { GameModule } from './game/game.module';
import { AvatarModule } from './avatar/avatar.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(configService.getTypeOrmConfig()),
    UsersModule,
    AuthModule,
    ChatModule,
    ConfigModule.forRoot({
      validationSchema: Joi.object({
        //...
        JWT_SECRET: Joi.string().required(),
        JWT_EXPIRATION_TIME: Joi.string().required(),
      }),
    }),
    FriendsModule,
    GameModule,
    AvatarModule
  ],
  controllers: [AppController],
  providers: [AppService, GameGateway, BorderlessGateway],
})
export class AppModule { }
