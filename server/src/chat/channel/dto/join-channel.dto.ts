import { IsNotEmpty } from 'class-validator';

export class JoinChannelDto {
  @IsNotEmpty()
  channelId: string;
  password: string;
}
