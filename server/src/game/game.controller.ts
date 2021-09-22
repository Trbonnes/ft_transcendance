import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { GameService } from './game.service';
import { CreateGameDto } from './dto/create-game.dto';
import { UpdateGameDto } from './dto/update-game.dto';
import { UsersService } from 'src/users/users.service';
import { UpdateUserDto } from 'src/users/dto/update-user.dto';

@Controller('game')
export class GameController {
  constructor(private readonly gameService: GameService,
              private readonly usersService: UsersService) {}

  @Get()
  findAll() {
    return this.gameService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.gameService.findOne(id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.gameService.remove(id);
  }

  @Get('user/:id')
  async updateStatsByUserId(@Param('id') id: string) {
    let stats = await this.gameService.findStatsByUserId(id);
    if (stats)
      return this.usersService.update(id, stats as UpdateUserDto);
    else
      return null;
  }
}
