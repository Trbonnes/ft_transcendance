import { IsNotEmpty } from 'class-validator';

export class CreateChannelDto {
  @IsNotEmpty()
  channelName: string;
  isPublic: boolean;
  channelPassword: string;
}
