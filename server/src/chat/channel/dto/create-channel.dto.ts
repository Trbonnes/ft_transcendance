import { IsNotEmpty } from 'class-validator';

export class CreateChannelDto {
  @IsNotEmpty()
  channelName: string;
  isPrivate: boolean;
  channelPassword: string;
}
