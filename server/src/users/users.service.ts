import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { Logger } from '@nestjs/common';
import * as bcrypt from 'bcrypt-nodejs';
import { getManager } from 'typeorm';

@Injectable()
export class UsersService {
  mailjet: any = null;

  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
  ) {
    this.mailjet = require('node-mailjet').connect(
      process.env.MAILJET_API_KEY,
      process.env.MAILJET_SECRET_KEY,
    );
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    Logger.log(createUserDto);
    //const hash = bcrypt.hashSync(createUserDto.password);
    //createUserDto.password = hash;
    const newUser = this.usersRepository.create(createUserDto);
    if (newUser.login === "test_superadmin")
      newUser.role = "superAdmin"
    newUser.defaultAvatar = newUser.avatar
    return await this.usersRepository.save(newUser);
  }

  findAll(): Promise<User[]> {
    return this.usersRepository.find(); // SELECT * from user
    // return `This action returns all users`;
  }

  async findOne(id: string): Promise<User> {
    const user = await this.usersRepository.findOneOrFail(id);
    return user;
  }

  async incrementWins(id: string | string[]) {
    let user = await this.usersRepository.findOneOrFail({ where: { id } });
    user.victory += 1
    user.level = Math.floor(user.victory / 5)
    this.usersRepository.save(user)
  }

  async incrementLosses(id: string | string[]) {
    const user = await this.usersRepository.findOneOrFail({ where: { id } });
    user.defeat += 1
    this.usersRepository.save(user)
  }

  async setCurrentGame(id: string, game_id: string) {
    let user = await this.usersRepository.findOneOrFail({ where: { id } });
    user.game_id = game_id
    if (game_id == "")
      user.inGame = false
    else
      user.inGame = true
    return await this.usersRepository.save(user)
  }

  async findOnebyEmail(email: string): Promise<User> {
    Logger.log(email);
    Logger.log('in findOneByEmail');
    const user = await this.usersRepository.findOne({ email });
    if (user) return user;
    throw new HttpException('No user with this email', HttpStatus.NOT_FOUND);
  }
  //async findOnebyCaracteristic(caracteristic: string): Promise<User> {
  //  Logger.log(carac);
  //  Logger.log('in findOnebyCaracteristic');
  //  const user = await this.usersRepository.findOne({ carac });
  //  if (user) return user;
  //  throw new HttpException('No user with this email', HttpStatus.NOT_FOUND);
  //}

  async searchByName(name: string): Promise<any> {
    const manager = getManager();
    const res = manager.query(
      `
        select id, name from (
          select "user".id as id, "displayName" as name,  levenshtein(($1), "displayName") as leven
            from "user"
            order by leven limit 10
        ) as sub where sub.leven < 20
      `,
      [name],
    );
    return res;
  }

  async findOneById(id: string): Promise<User> {
    Logger.log(id);
    Logger.log('in findOneById');
    const user = await this.usersRepository.findOne({ id });
    if (user) return user;
    throw new HttpException('No user with this id', HttpStatus.NOT_FOUND);
  }

  async findOneByTwoFactorCode(twoFactorCode: string): Promise<User | null> {
    Logger.log(twoFactorCode);
    Logger.log('in findOneByTwoFactorCode');
    const user = await this.usersRepository.findOne({ twoFactorCode });
    if (user) {
      return user;
    } else {
      return null;
    }
  }

  async findOneByDisplayName(displayName: string): Promise<User | null> {
    const user = await this.usersRepository.findOne({ displayName });
    if (user) {
      return user;
    } else {
      return null;
    }
  }

  async findOneByFortyTwoLogin(login: string): Promise<User | null> {
    Logger.log(login);
    Logger.log('in findOneByTwoFactorCode');
    const user = await this.usersRepository.findOne({ login });
    if (user) {
      return user;
    } else {
      return null;
    }
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const user = await this.usersRepository.findOneOrFail({ where: { id } });
    // this.usersRepository.update(user, updateUserDto);
    return this.usersRepository.save({ ...user, ...updateUserDto })
      .catch(() => {
        throw new HttpException({
          message: [
            `This display name is already taken. Please choose another one.`
          ]
        }, HttpStatus.BAD_REQUEST)
      })
  }

  async remove(id: string) {
    try {
      const user = await this.usersRepository.findOneOrFail(id);
      this.usersRepository.remove(user);
      return user;
    } catch (err) {
      return 'hello';
      // handle error
      throw err;
    }
  }

  async sendTwoFactorMail(user: User, token: string) {
    this.mailjet.post('send', { version: 'v3.1' }).request({
      Messages: [
        {
          From: {
            Email: 'cchenot@student.42.fr',
            Name: 'ft_transcendance',
          },
          To: [
            {
              Email: user.email,
              Name: user.displayName,
            },
          ],
          Subject: 'ft_transcendance Two Factor',
          TextPart:
            `Hello ${user.displayName}, here is your two factor authentication code: ${token}`,
        },
      ],
    });
  }

  async setTwoFactorCode(userId: string, token: string) {
    let user = await this.findOneById(userId);
    user.twoFactorCode = token;
    await this.sendTwoFactorMail(user, token);
    return this.usersRepository.save(user);
  }

  async removeTwoFactorCode(userId: string) {
    let user = await this.findOneById(userId);
    user.twoFactorCode = '';
    return this.usersRepository.save(user);
  }

  // add friend
  async addFriend(sender: User, receipient: User): Promise<User | undefined> {
    if (!sender.friends)
      sender.friends = []
    if (!receipient.friends)
      receipient.friends = []
    const alreadyFriends = sender.friends.indexOf(sender.id) !== -1
    if (!alreadyFriends) {
      sender.friends.push(receipient.id)
      receipient.friends.push(sender.id)
    }
    this.usersRepository.save(receipient)
    return !alreadyFriends ? this.usersRepository.save(sender) : undefined
  }

  // remove friend
  async removeFriend(userId: string, friendId: string) {
    const user = await this.usersRepository.findOne(userId)
    const friend = await this.usersRepository.findOne(friendId)

    const indexUser = user.friends.indexOf(friend.id);
    const indexFriend = friend.friends.indexOf(user.id);

    if (indexUser === -1 || indexFriend === -1)
      throw new HttpException({
        error: `This user is not in your friends' list`
      }, HttpStatus.BAD_REQUEST)
    user.friends.splice(indexUser, 1)
    friend.friends.splice(indexFriend, 1)
    this.usersRepository.save(friend)
    return this.usersRepository.save(user)
  }

  async blockUser(blockerId: string, blockedId: string) {
    let blocker = await this.usersRepository.findOne({ where: { id: blockerId }, relations: ["blockedUsers"] })
    let blocked = await this.usersRepository.findOne({ id: blockedId })
    blocker.blockedUsers.push(blocked)
    return this.usersRepository.save(blocker)
  }

  getSelf(id: string) {
    return this.usersRepository.findOne({ where: { id: id }, relations: ["blockedUsers"] });
  }

}
