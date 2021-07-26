
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
import { ConfigModule, ConfigService } from '@nestjs/config';
import { jwtConstants } from './constants';
import { JwtStrategy } from './jwt.strategy';
@Module({
  imports: [
	UsersModule,
	TypeOrmModule.forFeature([User]),
	PassportModule,
	JwtModule.registerAsync({
		imports: [ConfigModule],
		inject: [ConfigService],
		useFactory: async (configService: ConfigService) => ({
		  secret: configService.get('JWT_SECRET'),
		  signOptions: {
			expiresIn: `${configService.get('JWT_EXPIRATION_TIME')}s`,
		  },
		}),
	  }),
	],
  providers: [AuthService, UsersService, LocalStrategy, ConfigService, JwtStrategy],
  exports: [AuthService, JwtModule]
})
export class AuthModule {}