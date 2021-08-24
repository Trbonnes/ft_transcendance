import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FriendRequest } from 'src/entities/friend-request.entity';
import { User } from 'src/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import { Repository } from 'typeorm';

@Injectable()
export class FriendsService {

	constructor(private usersService: UsersService,
				@InjectRepository(FriendRequest) private friendRequestRepository: Repository<FriendRequest>) {}

	// Check if friend request exists
	async hasRequest(sender: User, receipient: User): Promise<FriendRequest | undefined> {
		return (this.friendRequestRepository.findOne({
			where: {
				sender, receipient
			}
		}))
	}

	// Find LoggedUser's friend requests
	async findAllRequests(id: string): Promise<FriendRequest[]> {
		const sender = await this.usersService.findOneById(id)
		if (!sender)
			throw new HttpException({
				error: `User not found`
			}, HttpStatus.BAD_REQUEST)
		return this.friendRequestRepository.find({
			relations: [
				'sender', 'receipient'
			],
			where: [
				{ sender: sender },
				{ receipient: sender }
			]
		})
	}

	// Send friend request
	async sendFriendRequest(senderId: string, receipient: User) {
		const sender = await this.usersService.findOneById(senderId)
		if (sender && !await this.hasRequest(sender, receipient)) {
			if (senderId === receipient.id)
				throw new HttpException({
					error: `You can't add yourself as friend.`
				}, HttpStatus.BAD_REQUEST)
			const friendRequest = this.friendRequestRepository.create({
				sender, receipient
			})
			return this.friendRequestRepository.save(friendRequest)
		} else {
			throw new HttpException({
				error: `You have already sent this request.`
			}, HttpStatus.BAD_REQUEST)
		}
	}

	// Accept a friend request
	async acceptFriendRequest(id: string, sender: User): Promise<User> {
		let receipient = await this.usersService.findOneById(id);
		if (!receipient)
			throw new HttpException({
				error: `Friend request's receipient does not exist`
			}, HttpStatus.BAD_REQUEST)
		const friendRequest = await this.friendRequestRepository.findOne({where: {sender, receipient}})
		if (!friendRequest)
			throw new HttpException({
				error: `This friend request does not exist.`
			}, HttpStatus.BAD_REQUEST)
		receipient = await this.usersService.addFriend(receipient, sender)
		if (!receipient)
			throw new HttpException({
				error: `You are already friends`
			}, HttpStatus.BAD_REQUEST)
		await this.friendRequestRepository.remove(friendRequest)
		return sender;
	}

	// Remove a friend
	async removeFriend(id: string, friend: User) {
		return this.usersService.removeFriend(friend.id, id);
	}
	
}
