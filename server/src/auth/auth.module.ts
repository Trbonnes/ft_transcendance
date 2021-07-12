import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersModule } from '../users/users.module';
import { UsersService } from 'src/users/users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { LocalStrategy } from './local.strategy';
import { PassportModule } from '@nestjs/passport';
import { configService } from '../config/config.service';
import { JwtModule, JwtService, JwtModuleOptions } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { jwtConstants } from './constants';
@Module({
  imports: [
	UsersModule,
	TypeOrmModule.forFeature([User]),
	PassportModule,
	JwtModule.register({
		secret: jwtConstants.secret,
		signOptions: {expiresIn: '60s'}
	})
	],
  providers: [AuthService, UsersService, LocalStrategy],
  exports: [AuthService, JwtModule]
})
export class AuthModule {}