import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UsePipes,
  ValidationPipe,
  UseGuards,
  Req,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Logger } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Request, response } from 'express';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('register')
  //@UsePipes(ValidationPipe)
  register(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  //  @UseGuards(JwtAuthGuard)
  @Get('/search/:name')
  searchByName(@Param('name') name: string) {
    return this.usersService.searchByName(name);
  }

  @Get()
  async findAllOrByLogin(@Req() req: Request) {
    if (req.query.login) {
      const user = await this.usersService.findOneByFortyTwoLogin(req.query.login.toString())
      Logger.log(user)
      Logger.log("in findAllorByLogin");
      if (!user)
        throw new HttpException({
          message: [ `This user does not exist.`]
        }, HttpStatus.BAD_REQUEST)
      return user;
    }
    else {
      return this.usersService.findAll();
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOneById(id);
  }

  @Patch('me')
  @UseGuards(JwtAuthGuard)
  update(@Req() request, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(request.user.id, updateUserDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}
