import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config'
import * as Joi from '@hapi/joi';
import { configService } from './config/config.service';
import { UsersModule } from './users/users.module';
import { ChatGateway } from './app.chatgateway';
import { AuthModule } from './auth/auth.module';
import { FooModule } from './foo/foo.module';
import { AuthService } from './auth/auth.service';
import { JwtService } from '@nestjs/jwt';
import { ChatModule } from './chat/chat.module';
import { AuthController } from './auth/auth.controller';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
	TypeOrmModule.forRoot(configService.getTypeOrmConfig()),
	UsersModule,
	AuthModule,
	FooModule,
  ConfigModule.forRoot({
    validationSchema: Joi.object({
      //...
      JWT_SECRET: Joi.string().required(),
      JWT_EXPIRATION_TIME: Joi.string().required(),
    })
  })
  ],
  controllers: [AppController, AuthController],
  providers: [AppService, /*GameGateway*/, ChatGateway],
})
export class AppModule {}
