import { IsNotEmpty } from 'class-validator';

export class CreateChannelDto {
  users: string[]; // list of ids
  owner: string; // id of admin
}
