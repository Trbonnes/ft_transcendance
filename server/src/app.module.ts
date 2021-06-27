import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config'
import * as Joi from '@hapi/joi';
import { configService } from './config/config.service';
import { UsersModule } from './users/users.module';
import { ChatGateway, GameGateway } from './app.gateway';
import { AuthModule } from './auth/auth.module';
import { FooModule } from './foo/foo.module';

@Module({
  imports: [
	TypeOrmModule.forRoot(configService.getTypeOrmConfig()),
	UsersModule,
	AuthModule,
	FooModule,
  ],
  controllers: [AppController],
  providers: [AppService, GameGateway, ChatGateway],
})
export class AppModule {}
