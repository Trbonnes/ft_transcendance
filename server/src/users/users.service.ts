import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {User} from '../entities/user.entity';
import { Logger } from '@nestjs/common';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private usersRepository: Repository<User> ) {

  }
  create(createUserDto: CreateUserDto): Promise<User> {
	Logger.log(createUserDto)
	const newUser = this.usersRepository.create(createUserDto)
    return this.usersRepository.save(newUser);  
  }

  findAll(): Promise<User[]> {
	return this.usersRepository.find(); // SELECT * from user
    // return `This action returns all users`;
  }

  async findOne(id: string): Promise<User> {
	try {
		const user = await this.usersRepository.findOneOrFail(id);
		return user;
	} catch (err) {
		// handle error
		throw err;
	}
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;  
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
