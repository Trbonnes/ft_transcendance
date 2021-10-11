import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UsersService } from 'src/users/users.service';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { randomBytes } from 'crypto';
import { jwtConstants } from './constants';
import { RefreshDto } from './dto/refresh.dto';
import { JwtAuthGuard } from './jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  @Post('/login')
  async login(@Body() body: LoginDto, @Res() response: Response) {
    const code = body.code;
    const twoFactorCode = body.twoFactorCode;
    let user = null;

    if (code === 'twoFactorAuthenticationActivated') {
      user = await this.usersService.findOneByTwoFactorCode(twoFactorCode);
      if (!user)
        throw new HttpException(
          {
            error: 'Two Factor Authentication code is invalid',
            type: 'wrong_twofactor',
          },
          HttpStatus.UNAUTHORIZED,
        );
    } else {
      if (user && user.banned === true) {
        throw new HttpException(
          {
            error: 'login error: user was banned',
          },
          HttpStatus.UNAUTHORIZED,
        );
      }
      const fortyTwoUser = await this.authService.getFortyTwoUser(code);
      if (!fortyTwoUser) {
        throw new HttpException(
          {
            error: '42 User not found',
          },
          HttpStatus.BAD_REQUEST,
        );
      }
      user = await this.usersService.findOneByFortyTwoLogin(fortyTwoUser.login);
      if (user === null) {
        let userDto = new CreateUserDto()
          .setEmail(fortyTwoUser.email)
          .setLogin(fortyTwoUser.login)
          .setDisplayName(fortyTwoUser.displayname)
          .setFirstName(fortyTwoUser.displayname)
          .setAvatar(fortyTwoUser.image_url);

        user = await this.usersService.create(userDto);
      }
    }
    if (user && user.banned === true) {
      throw new HttpException(
        {
          error: 'login error: user was banned',
        },
        HttpStatus.UNAUTHORIZED,
      );
    }
    if (user.twoFactor) {
      if (!twoFactorCode) {
        const token = randomBytes(6).toString('hex');
        await this.usersService.setTwoFactorCode(user.id, token);
        throw new HttpException(
          {
            error: 'Please enter the two factor code you received by email',
            type: 'missing_twofactor',
          },
          HttpStatus.UNAUTHORIZED,
        );
      } else {
        if (twoFactorCode !== user.twoFactorCode) {
          throw new HttpException(
            {
              error: 'Your two factor authentication code is invalid',
              type: 'missing_twofactor',
            },
            HttpStatus.UNAUTHORIZED,
          );
        } else await this.usersService.removeTwoFactorCode(user.id);
      }
    }
    const payload = {
      login: user.login,
      id: user.id,
    };
    const access_token = await this.authService.generateToken(payload);
    const refresh_token = await this.authService.generateToken(payload, {
      expiresIn: `${60 * 60 * 24 * 7}s`,
    });
    this.usersService.update(user.id, user);
    return response.status(200).json({
      access_token,
      refresh_token,
      expires_in: jwtConstants.expiresIn,
    });
  }

  @Post('/refresh')
  async refresh(@Body() refreshDto: RefreshDto, @Res() response: Response) {
    const refresh_token = refreshDto.refresh_token;
    const new_access_token = await this.authService.refreshToken(refresh_token);
    if (new_access_token) {
      return response.status(200).json({
        access_token: new_access_token,
        expires_in: jwtConstants.expiresIn,
      });
    } else {
      return response.status(401).json({
        statusCode: 401,
        error: 'Unauthorized',
        message: 'Invalid token.',
      });
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('/user')
  async user(@Req() request, @Res() response: Response) {
    const user = await this.usersService.getSelf(request.user.id);
    return response.status(200).json(user);
  }

  @Post('/testuser')
  async testUserLogin(@Req() request, @Res() response: Response) {
    const testUser = `test_${request.query.user}`;
    let user = await this.usersService.findOneByFortyTwoLogin(testUser);
    if (user === null) {
      let userDto = new CreateUserDto()
        .setEmail(`${testUser}@testuser.com`)
        .setLogin(testUser)
        .setDisplayName(testUser)
        .setFirstName(testUser)
        .setAvatar(
          'https://upload.wikimedia.org/wikipedia/commons/thumb/2/26/Tabletennis.jpg/1200px-Tabletennis.jpg',
        );

      user = await this.usersService.create(userDto);
    } else if (user.banned === true) {
      throw new HttpException(
        {
          error: 'login error: user was banned',
        },
        HttpStatus.UNAUTHORIZED,
      );
    }

    const payload = {
      login: user.login,
      id: user.id,
    };
    const userDTO = await this.usersService.findOneById(user.id);
    await this.usersService.update(user.id, userDTO);
    const access_token = await this.authService.generateToken(payload);
    const refresh_token = await this.authService.generateToken(payload, {
      expiresIn: `${60 * 60 * 24 * 7}s`,
    });
    return response.status(200).json({
      access_token,
      refresh_token,
      expires_in: jwtConstants.expiresIn,
    });
  }
}
