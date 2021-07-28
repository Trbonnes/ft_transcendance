import { IsNotEmpty } from "class-validator"

export class CreateUserDto {
	
	@IsNotEmpty()
	email: string
	
	@IsNotEmpty({ message: `password required`})
	password: string

	@IsNotEmpty()
	name: string

	// @IsNotEmpty({ message: `isAdministrator boolean required` })
	isAdministrator: boolean

}
