import { Body, Controller, Delete, Get, Post, Req, UseGuards } from '@nestjs/common';
import { request } from 'express';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { FriendRequest } from 'src/entities/friend-request.entity';
import { AcceptFriendRequestDto } from './dto/accept-request.dto';
import { FriendRequestDto } from './dto/friend-request.dto';
import { RemoveFriendDto } from './dto/remove-friend.dto';
import { FriendsService } from './friends.service';

@Controller('friends')
export class FriendsController {
	constructor(private friendsService: FriendsService) {}

	// Get all request
	@Get('requests')
	@UseGuards(JwtAuthGuard)
	findAllRequests(@Req() request): Promise<FriendRequest[]> {
		return this.friendsService.findAllRequests(request.user.id);
	}

	// Send a friend request
	@Post('requests')
	@UseGuards(JwtAuthGuard)
	sendFriendRequest(@Req request, @Body() friendRequest: FriendRequestDto): Promise<FriendRequest> {
		return this.friendsService.sendFriendRequest(request.user.id, friendRequest.receipient)
	}

	// Accept a request
	@Post('accept')
	@UseGuards(JwtAuthGuard)
	acceptFriendRequest(@Req() request, @Body() acceptFriendRequest: AcceptFriendRequestDto): Promise<User> {
		return this.friendsService.acceptFriendRequest(request.user.id, acceptRequest.sender);
	}

	// Remove a friend
	@Delete()
	@UseGuards(JwtAuthGuard)
	removeFriend(@Req() request, @Body() removeFriend: RemoveFriendDto): Promise<User> {
		return this.friendsService.removeFriend(request.user.id, removeFriend.friend);
	}
}
