import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersModule } from '../users/users.module';
import { UsersService } from 'src/users/users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { LocalStrategy } from './local.strategy';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [UsersModule, TypeOrmModule.forFeature([User]), PassportModule],
  providers: [AuthService,  UsersService, LocalStrategy]
})
export class AuthModule {}