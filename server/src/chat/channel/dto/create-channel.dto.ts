import { IsNotEmpty } from 'class-validator';

export class CreateChannelDto {
  @IsNotEmpty()
  owner: string; // id of the owner

  members: string[]; // ids of the members
}
