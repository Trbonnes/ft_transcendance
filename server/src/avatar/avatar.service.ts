import { Injectable, Logger } from '@nestjs/common';
import { unlink } from 'fs';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AvatarService {

	constructor(private usersService: UsersService) {}
	
	private logger: Logger = new Logger()

	async deleteFile(id: string): Promise<string> {
		let user = await this.usersService.findOneById(id)
		const filename = user.avatarFileName
		const fs = require("fs")
		if (fs.existsSync(`./uploads/${filename}`)) {
			unlink(`./uploads/${filename}`, () => {
				this.logger.log(`${user.displayName} avatar deleted from storage`)
			})
			return "OK";
		}
		return "FAIL";
	}

}
