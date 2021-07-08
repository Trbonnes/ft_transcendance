import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config'
import * as Joi from '@hapi/joi';
import { configService } from './config/config.service';
import { UsersModule } from './users/users.module';
import { GameGateway } from './app.gamegateway';
import { BorderlessGateway } from './app.borderlessgateway';
import { ChatGateway } from './app.chatgateway';

@Module({
  imports: [
	TypeOrmModule.forRoot(configService.getTypeOrmConfig()),
	UsersModule,
  ],
  controllers: [AppController],
  providers: [AppService, GameGateway, ChatGateway, BorderlessGateway],
})
export class AppModule {}
