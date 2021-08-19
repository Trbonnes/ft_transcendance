import { HttpException, HttpStatus } from "@nestjs/common";

export const avatarFileFilter = (req, file, callback) => {
	if (!file.originalname.toLowerCase().match(/\.(jpg|png|jpeg|gif)$/)) {
		return callback(new HttpException({
			message: ['Uploaded file is not an image file.']
		}, HttpStatus.BAD_REQUEST), false);
	}
	callback(null, true);
};