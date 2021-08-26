import { Module } from '@nestjs/common';
import { ChannelModule } from './channel/channel.module';
import { AuthModule } from 'src/auth/auth.module';
import { UsersModule } from 'src/users/users.module';
import { ChatGateway } from './app.chatgateway';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { Channel } from 'src/entities/channel.entity';

@Module({
  imports: [
    ChannelModule,
    AuthModule,
    UsersModule,
    TypeOrmModule.forFeature([Channel, User]),
  ],
  providers: [ChatGateway],
})
export class ChatModule {}
