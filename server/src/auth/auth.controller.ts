import { Body, Req, Controller, HttpCode, Post, UseGuards, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Response } from 'express';
// import RegisterDto from './dto/register.dto';
// import RequestWithUser from './requestWithUser.interface';
import { LocalAuthGuard } from './localAuthGuard';
import RequestWithUser from "./requestWithUser.interface"
import JwtAuthGuard from './jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService
  ) {}
  @Post('register')
  async register(@Body() registrationData) { // add DTO later
    return this.authService.register(registrationData);
  }
  @HttpCode(200)
  @UseGuards(LocalAuthGuard)
  @Post('log-in')
  async logIn(@Req() request: RequestWithUser, @Res() response: Response) {
    const {user} = request;
  const cookie = this.authService.getCookieWithJwtToken(user.id);
  response.setHeader('Set-Cookie', cookie);
  user.password = undefined;
  return response.send(user);
  }

  @UseGuards(JwtAuthGuard)
  @Post('log-out')
  async logOut(@Req() request: RequestWithUser, @Res() response: Response) {
    response.setHeader('Set-Cookie', this.authService.getCookieForLogOut());
    return response.sendStatus(200);
  }
} 