import { HttpService, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly httpService: HttpService,
  ) {}

  async getFortyTwoUser(code: string): Promise<any | null> {
    try {
      const token = await this.httpService
        .post(
          `https://api.intra.42.fr/oauth/token?grant_type=authorization_code&client_id=d73b8e0595edbca83bfbb2d40ae5d23cc10dc67454fc750da0619aff86c64b83&client_secret=453abb9beb4823e60945a7f7b9352cd86495e7a63c5555d14e5743a6eb5d3f15&code=${code}&redirect_uri=http://localhost:80/auth/42`,
        )
        .toPromise()
        .then((response) => response.data);
      const fortyTwoUser = await this.httpService
        .get('https://api.intra.42.fr/v2/me', {
          headers: {
            Authorization: `Bearer ${token.access_token}`,
          },
        })
        .toPromise()
        .then((response) => response.data);
      return fortyTwoUser;
    } catch (err) {
      return null;
    }
  }

  async validateToken(accessToken: string): Promise<any | null> {
    try {
      const validation = await this.jwtService.verify(accessToken);
      return validation;
    } catch (err) {
      return null;
    }
  }

  validateTokenSync(accessToken: string) {
    try {
      const validation = this.jwtService.verify(accessToken);
      return validation;
    } catch (e: any) {
      return null;
    }
  }

  async generateToken(payload: any, args?: any): Promise<string> {
    return this.jwtService.sign(payload, args);
  }

  async refreshToken(refreshToken: string): Promise<any | null> {
    const validation = await this.validateToken(refreshToken);
    if (validation) {
      return this.generateToken({
        id: validation.id,
      });
    } else {
      return null;
    }
  }
}
