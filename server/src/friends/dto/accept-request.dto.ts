import { IsObject } from "class-validator";
import { User } from "src/entities/user.entity";

export class AcceptFriendRequestDto {
	@IsObject()
	sender: User
}