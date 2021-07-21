import { Controller, Get, Request, Post, UseGuards, Logger } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { log } from 'console';
import { AppService } from './app.service';
import { AuthService } from './auth/auth.service';
// import { LocalAuthGuard } from './auth/local-auth.guard';

@Controller()
export class AppController {
  // constructor(private authService: AuthService) {}

  // @UseGuards(LocalAuthGuard)

}
