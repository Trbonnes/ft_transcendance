// import { Inject, CanActivate, ExecutionContext, Injectable, Request } from '@nestjs/common';
// import { Observable } from 'rxjs';
// import { User } from '../entities/user.entity';
// import { UsersService } from './users.service';

// @Injectable()
// export class UserAdminGuard implements CanActivate {
//   constructor(private readonly usersService: UsersService) { }
//   canActivate(
//     context: ExecutionContext,
//   ): boolean | Promise<boolean> | Observable<boolean> {
//     const req: any = context.switchToHttp().getRequest<Request>()
//     // console.log(req)
//     if (!req.user)
//       return false
//     else
//       return false

//     return this.usersService.findOne(req.params.email).then(async (user: User) => {
    
//     if (user.role === "admin" || user.role === "superAdmin")
//         return true
//     else
//         return false
//     })
//       .catch(() => {
//         return false
//       })
//     // // console.log("Guard code")
//     // // console.log(req.url)
//   }
// }
