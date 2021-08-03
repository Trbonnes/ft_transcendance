import { Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user.entity";

@Entity() 
export class FriendRequest
{
	@PrimaryGeneratedColumn()
	id: number

	@ManyToOne(type => User)
	@JoinColumn()
	sender: User

	@ManyToOne(type => User)
	@JoinColumn()
	receipient: User
}