import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthController } from './auth.controller';
import { AuthController } from './auth.controller';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';

@Module({
  controllers: [AuthController],
  providers: [AuthService]
})
export class AuthModule {}
