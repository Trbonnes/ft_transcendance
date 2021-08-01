import { IsNotEmpty, IsOptional } from "class-validator"

export class CreateUserDto {
	
	@IsNotEmpty()
	email: string
	
	@IsNotEmpty({ message: `password required`})
	password: string

	@IsNotEmpty()
	name: string
	
	@IsOptional()
	avatar: string // link to the image

	@IsOptional()
	twoFactor: boolean

	// @IsNotEmpty({ message: `isAdministrator boolean required` })
	//isAdministrator: boolean

}
