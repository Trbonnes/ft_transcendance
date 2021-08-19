import { Injectable, Logger } from '@nestjs/common';
import { unlink } from 'fs';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AvatarService {

	constructor(private usersService: UsersService) {}
	
	private logger: Logger = new Logger()

//	deleteFile(login: string): string {
//		const fs = require("fs")
//		if (fs.existsSync(`./uploads/${login}`)) {
//			unlink(`./uploads/${login}`, () => {
//				this.logger.log(`${login} avatar deleted from storage`)
//			})
//			return "OK";
//		return "FAIL";
//	}
//
}
