import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/entities/user.entity';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt-nodejs'
import { ConfigModule, ConfigService } from '@nestjs/config';
import TokenPayload from "./tokenPayload.interface"
// import PostgresErrorCode from '../database/postgresErrorCode.enum';
@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService
  ) {}

  public getCookieWithJwtToken(userId: string) {
    const payload: TokenPayload = { userId };
    const token = this.jwtService.sign(payload);
    return `Authentication=${token}; HttpOnly; Path=/; Max-Age=${this.configService.get('JWT_EXPIRATION_TIME')}`;
  }

  public getCookieForLogOut() {
    return `Authentication=; HttpOnly; Path=/; Max-Age=0`;
  }
  
  public async register(registrationData) {
    const hashedPassword = await bcrypt.hashSync(registrationData.password);
    try {
      const createdUser = await this.usersService.create({
        ...registrationData,
        password: hashedPassword
      });
      createdUser.password = undefined;
      return createdUser;
    } catch (error) {
      throw new HttpException('Something went wrong', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  public async getAuthenticatedUser(email: string, plainTextPassword: string) {
    try {
      const user = await this.usersService.findOnebyEmail(email);
      await this.verifyPassword(plainTextPassword, user.password);
      user.password = undefined;
      return user;
    } catch (error) {
      throw new HttpException('Wrong credentials provided', HttpStatus.BAD_REQUEST);
    }
  }

  public getUserIdFromJwt(token) {
    const decoded : string | { [key:string] : string } = this.jwtService.decode(token);
    const decodedString = JSON.stringify(decoded);
    const userId = JSON.parse(decodedString).userId;
    return userId;
  }

  async getUserFromCookie(token) {
    const id = this.getUserIdFromJwt(token);
    console.log(id);
    const user = await this.usersService.findOnebyId(id);
    if (user)
      return user;
    throw new HttpException("No user with this id", HttpStatus.NOT_FOUND);
  }
   
  private async verifyPassword(plainTextPassword: string, hashedPassword: string) {
    const isPasswordMatching = bcrypt.compareSync(
      plainTextPassword,
      hashedPassword
    );
    if (!isPasswordMatching) {
      throw new HttpException('Wrong credentials provided', HttpStatus.BAD_REQUEST);
    }
  }

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.usersService.findOnebyEmail(email);
    if (user && user.password === pass) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  login(user: User) {
    const payload = { email: user.email, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}