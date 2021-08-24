import { IsOptional, IsString, Length } from "class-validator";

export class UpdateUserDto {
	@IsOptional()
	@IsString()
	@Length(2, 20)
	display_name:string

	@IsOptional()
	twoFactor: boolean

	@IsOptional()
	//@IsImageCheck()
	avatar: string

	@IsOptional()
	game_id: string

	@IsOptional()
	inGame: boolean
}