import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { Logger } from '@nestjs/common';
import * as bcrypt from 'bcrypt-nodejs';
@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private usersRepository: Repository<User> ) {

  }
  async create(createUserDto: CreateUserDto): Promise<User> {
	Logger.log(createUserDto)
	const hash = bcrypt.hashSync(createUserDto.password);
	createUserDto.password = hash;
	const newUser = this.usersRepository.create(createUserDto)
    return await this.usersRepository.save(newUser);
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

  async	findOnebyEmail(email: string): Promise<User> {
	Logger.log(email)
	Logger.log("in findOneByEmail");
	const user = await this.usersRepository.findOne({ email });
	if (user)
		return user;
	throw new HttpException("No user with this email", HttpStatus.NOT_FOUND);
  }

  async	findOnebyId(id: string): Promise<User> {
	Logger.log(id)
	Logger.log("in findOneById");
	const user = await this.usersRepository.findOne({ id });
	if (user)
		return user;
	throw new HttpException("No user with this id", HttpStatus.NOT_FOUND);
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
	try {
		const user = await this.usersRepository.findOneOrFail({where: {id}});
		// this.usersRepository.update(user, updateUserDto);
		return this.usersRepository.save({...user, ...updateUserDto})
		// return user;
	} catch (err) {
		// handle error
		throw err;
	}
  }

  async remove(id: string) {
	try {
		const user = await this.usersRepository.findOneOrFail(id);
		this.usersRepository.remove(user);
		return user
	} catch (err) {
		return "hello"
		// handle error
		throw err;
	}
  }
}
