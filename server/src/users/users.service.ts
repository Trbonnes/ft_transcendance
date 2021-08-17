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

  async findOnebyEmail(email: string): Promise<User> {
    Logger.log(email);
    Logger.log('in findOneByEmail');
    const user = await this.usersRepository.findOne({ email });
    if (user) return user;
    throw new HttpException('No user with this email', HttpStatus.NOT_FOUND);
  }

  async searchByName(name: string): Promise<any> {
    const manager = getManager();
    const res = manager.query(
      'select id, name leven from "user" order by levenshtein(($1), "user".name) limit 10',
      [name],
    );
    return res;
  }

  async findOnebyId(id: string): Promise<User> {
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
    let user = await this.findOnebyId(userId);
    user.twoFactorCode = token;
    await this.sendTwoFactorMail(user, token);
    return this.usersRepository.save(user);
  }

  async removeTwoFactorCode(userId: string) {
    let user = await this.findOnebyId(userId);
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

}
