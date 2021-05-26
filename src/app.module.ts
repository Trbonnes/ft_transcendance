import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config'
import * as Joi from '@hapi/joi';
import { DatabaseModule } from './database/database.module';

@Module({
  imports: [
	ConfigModule.forRoot({
		validationSchema: Joi.object({
		  POSTGRES_HOST: Joi.string().required(),
		  POSTGRES_PORT: Joi.number().required(),
		  POSTGRES_USER: Joi.string().required(),
		  POSTGRES_PASSWORD: Joi.string().required(),
		  POSTGRES_DB: Joi.string().required(),
		  PORT: Joi.number(),
		})
	})
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
