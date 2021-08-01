import { IsNotEmpty, IsString } from "class-validator";

export class RefreshDto {
	@IsNotEmpty()
	@IsString()
	readonly refresh_token: string

}