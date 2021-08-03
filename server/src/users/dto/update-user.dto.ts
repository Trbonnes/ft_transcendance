import { IsOptional, IsString, Length } from "class-validator";

export class UpdateUserDto {
	@IsOptional()
	@IsString()
	@Length(2, 20)
	display_name:string

	@IsOptional()
	@IsString()
	twoFactor: boolean

	@IsOptional()
	//@IsImageCheck()
	avatar: string
}