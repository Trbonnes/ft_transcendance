import { HttpModule, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './constants';
import { UsersModule } from 'src/users/users.module';
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [ HttpModule, UsersModule, PassportModule, JwtModule.register({
    secret: jwtConstants.secret,
    signOptions: {
      expiresIn: jwtConstants.expiresIn
    },
  })],
  controllers: [AuthController],
  providers: [ AuthService, JwtModule, JwtStrategy ],
  exports: [AuthService]
})
export class AuthModule {}
