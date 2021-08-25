import { Module } from '@nestjs/common';
import { UsersModule } from 'src/users/users.module';
import { AvatarController } from './avatar.controller';
import { AvatarService } from './avatar.service';

@Module({
  imports: [UsersModule],
  controllers: [AvatarController],
  providers: [AvatarService]
})
export class AvatarModule {}
