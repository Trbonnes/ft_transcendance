import { Injectable, Logger } from '@nestjs/common';
import { CreateGameDto } from './dto/create-game.dto';
import { UpdateGameDto } from './dto/update-game.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Game } from '../entities/game.entity';
import { Repository } from 'typeorm';
import { User } from 'src/entities/user.entity';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class GameService {
  constructor(
    @InjectRepository(Game) private gameRepository: Repository<Game>,
    private readonly usersService: UsersService
    ) {}

  async create(game_id: string, players: string[]) {
    
    this.usersService.setCurrentGame(players[0], game_id)
    this.usersService.setCurrentGame(players[1], game_id)
    let newGame = new Game()
    newGame.game_id = game_id
    newGame.status = false

    return await this.gameRepository.save(newGame)
  }

  findAll() {
    return this.gameRepository.find();
  }

  async findOne(game_id: string) {
    const game = await this.gameRepository.findOne({ where: { game_id } });
    return game;
  }

  async findStatsByUserId(id: string) {
    const games = await this.findAll();
    Logger.log(games);
    let victories = games.filter((game) => game.winner_id === id).length;
    let defeats = games.filter((game) => game.loser_id === id).length;
    let level = Math.floor(victories / 5);
    return {
      victory: victories,
      defeat: defeats,
      level: level
    }
  }

  async update(game_id: string, winner_id: string, loser_id: string) {
    let game = await this.gameRepository.findOne( { where: {game_id} } )


    game.status = true
    game.winner_id = winner_id
    game.loser_id = loser_id

    this.usersService.setCurrentGame(winner_id, "")
    this.usersService.setCurrentGame(loser_id, "")

    // let hello = "world"
    return this.gameRepository.save( {...game} )
  }

  async remove(id: string) {
    const game = await this.gameRepository.findOneOrFail(id);
    this.gameRepository.remove(game);
  }
}
