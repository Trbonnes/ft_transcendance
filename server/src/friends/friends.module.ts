import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FriendRequest } from 'src/entities/friend-request.entity';
import { UsersModule } from 'src/users/users.module';
import { FriendsController } from './friends.controller';
import { FriendsService } from './friends.service';

@Module({
  imports: [ UsersModule, TypeOrmModule.forFeature([FriendRequest])],
  controllers: [FriendsController],
  providers: [FriendsService]
})
export class FriendsModule {}
