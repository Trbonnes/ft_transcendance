import { IsOptional, IsString, Length } from "class-validator";

export class UpdateUserDto {
	@IsOptional()
	@IsString()
	@Length(2, 20)
	displayName:string

	@IsOptional()
	twoFactor: boolean

	@IsOptional()
	//@IsImageCheck()
	avatar: string

	@IsOptional()
	avatarFileName: string
}