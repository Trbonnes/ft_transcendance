import { Injectable, CanActivate, ExecutionContext, Inject, forwardRef } from "@nestjs/common";
import { Observable } from "rxjs";
import { User } from "src/entities/user.entity";
import { UsersService } from "src/users/users.service";
import { ExtractJwt, Strategy } from "passport-jwt";
import { jwtConstants } from "./constants";
import { JwtAuthGuard } from "./jwt-auth.guard";
import { AuthGuard } from '@nestjs/passport';
import { HttpException, HttpStatus } from '@nestjs/common'

export class RolesGuard extends AuthGuard('jwt') {
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
      
	if (passportActivate) {
		const request = context.switchToHttp().getRequest();
		const id = request.user.id;
		const user: User = await this.usersService.findOneById(id)
		if (user && (user.role == "superAdmin" || user.role === "admin") )
			return true
	}
	throw new HttpException(
		'You do not have permission (Roles)',
		HttpStatus.UNAUTHORIZED,
	);

    }
  }