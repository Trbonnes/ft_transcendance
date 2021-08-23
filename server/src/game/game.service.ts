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
    
    const p1 = await this.usersService.findOne(players[0])
    const p2 = await this.usersService.findOne(players[1])
    let newGame = {
      game_id: game_id,
      status: false,
      players: [p1, p2]
    }
    // newGame.players[]
    return await this.gameRepository.save(newGame)
  }

  findAll() {
    return this.gameRepository.find();
  }

  async findOne(game_id: string) {
    const game = await this.gameRepository.findOne({ where: { game_id } });
    return game;
  }

  async update(game_id: string, winner_id: string, loser_id: string) {
    let game = await this.gameRepository.findOne( { where: {game_id} } )

    const winner = await this.usersService.findOne(winner_id)
    const loser = await this.usersService.findOne(loser_id)

    game.status = true
    game.winner = winner
    game.loser = loser
    // const updatedGame = {
    //   winnner: winner,
    //   loser: loser,
    //   status: true
    // }
    // winner.games.push(game)
    // Logger.log(winner.games)
    return this.gameRepository.save( {...game} )
  }

  async remove(id: string) {
    const game = await this.gameRepository.findOneOrFail(id);
    this.gameRepository.remove(game);
  }
}
