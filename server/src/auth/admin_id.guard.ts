import { ExecutionContext, Inject, forwardRef } from "@nestjs/common";
import { User } from "src/entities/user.entity";
import { UsersService } from "src/users/users.service";
import { ExtractJwt, Strategy } from "passport-jwt";
import { jwtConstants } from "./constants";
import { AuthGuard } from '@nestjs/passport';
import { HttpException, HttpStatus } from '@nestjs/common'

export class AdminIdGuard extends AuthGuard('jwt') {
    constructor(
		@Inject(UsersService) private readonly usersService: UsersService
	) {
      super({
		jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
		ignoreExpiration: false,
		secretOrKey: jwtConstants.secret

	  })
    }
    async canActivate(context: ExecutionContext): Promise<boolean> {
      const passportActivate = await super.canActivate(context) as boolean
      
    console.log("IN ADMINIDGUARD")
	if (passportActivate) {
		const request = context.switchToHttp().getRequest();
		const id = request.user.id;
		const user: User = await this.usersService.findOneById(id)
        const other_id = request.params.id
		const other_user: User = await this.usersService.findOneById(other_id)

        if (user && other_user &&
        (user.role === "superAdmin" ||
        (user.role === "admin" &&
        ( other_user.role != "admin" && other_user.role != "superAdmin" )) ) ) {
            return true
        }
	}
	throw new HttpException(
		'You do not have permission (Roles)',
		HttpStatus.UNAUTHORIZED,
	);

    }
  }