import { IsNotEmpty } from "class-validator"

export class CreateUserDto {
	
	email: string
	
	@IsNotEmpty({ message: `password required`})
	password: string

	name: string
	
	avatar: string // link to the image

	// @IsNotEmpty({ message: `isAdministrator boolean required` })
	isAdministrator: boolean

}
