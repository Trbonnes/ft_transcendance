import { HttpService, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {

	constructor(
		private usersService: UsersService,
		private readonly jwtService: JwtService,
		private readonly httpService: HttpService
	) {}

	async validateToken(accessToken: string) : Promise<any | null> {
		try {
			const value = await this.jwtService.verify(accessToken);
			return (value);
		} catch (err) {
			return null;
		}
	}

	async generateToken(payload: any, args?: any): Promise<string> {
		return this.jwtService.sign(payload, args)
	}

	async refreshToken(refreshToken:string): Promise<any | null> {
		const payload = await this.validateToken(refreshToken);
		if (payload) {
			return this.generateToken({
				id: payload.id
			})
		} else {
			return null;
		}
	}

	async getFortyTwoUser(code: string): Promise<any | null> {
		try {
			const token = await this.httpService.post('https://api.intra.42.fr/oauth/token?grant_type=authorization_code&client_id=${process.env.FT_OAUTH_UID}&client_scret=${process.env.FT_OAUTH_REDIRECT_URL}')
				.toPromise()
				.then(response => response.data)
			const fortyTwoUser = await this.httpService.get('https://api.intra.42.fr/v2/me', {
				headers: {
					Authorization: 'Bearer ${token.access_token}'
				}
			}).toPromise().then(response => response.data)
			return (fortyTwoUser)
		} catch (err) {
			return null;
		}
	}
}