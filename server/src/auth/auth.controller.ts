import { Controller } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {

	constructor(private readonly authService: AuthService,
				private readonly userService: UsersService,
				private readonly jwtService: JwtService) {}

	

}
