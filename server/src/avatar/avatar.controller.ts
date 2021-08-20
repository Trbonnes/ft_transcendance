import { Controller, Delete, Get, Param, Post, Req, Res, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { AvatarService } from './avatar.service';
import { Express, request, Response } from "express";
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from "multer"
import { fstat } from 'fs';
import { avatarFileFilter } from './avatar.filter';
import { avatarFileName } from './avatar.middleware';

@Controller('avatar')
export class AvatarController {
	constructor(private avatarService: AvatarService) {}

	@Get(":file")
	async findOne(@Param('file') file:string, @Res() res: Response) {
		const fs = require("fs");
		if (fs.existsSync(`./uploads/${file}`))
			return res.sendFile(`${file}`, {root: `./uploads`})
		return null;
	}

	@Post(":filename")
	@UseGuards(JwtAuthGuard)
	@UseInterceptors(
		FileInterceptor('file', {
			storage: diskStorage({
				destination: './uploads',
				filename: avatarFileName
			}),
			fileFilter: avatarFileFilter,
			limits: {fileSize: 2097152}
		})
	)
	addAvatar(@Param('filename') filename: string, @UploadedFile() file: Express.Multer.File) {
		return file.filename
	}

	@Delete(":id")
	@UseGuards(JwtAuthGuard)
	async remove(@Param('id') id:string) {
		return this.avatarService.deleteFile(id)
	}
}
