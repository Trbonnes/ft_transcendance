import { IsOptional, IsString, Length } from "class-validator";

export class UpdateUserDto {
	@IsOptional()
	@IsString()
	@Length(2, 16)
	displayName:string

	@IsOptional()
	twoFactor: boolean

	@IsOptional()
	//@IsImageCheck()
	avatar: string

	@IsOptional()
	game_id: string

	@IsOptional()
	inGame: boolean

	@IsOptional()
	avatarFileName: string
}