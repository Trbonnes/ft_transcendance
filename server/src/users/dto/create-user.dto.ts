import { IsNotEmpty } from "class-validator"

export class CreateUserDto {
	
	// @IsNotEmpty({ message: `id required` })

	@IsNotEmpty({ message: `password required`})
	password: string

	// @IsNotEmpty({ message: `isAdministrator boolean required` })
	isAdministrator: boolean
}
