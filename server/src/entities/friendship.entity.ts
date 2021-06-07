import { PrimaryGeneratedColumn, Column, UpdateDateColumn, CreateDateColumn, Entity, PrimaryColumn, ManyToMany } from 'typeorm';
import { User } from './user.entity';

@Entity()
export class Friendship {
	@PrimaryColumn()
	status: boolean // 0: pending 1:active

    @ManyToMany(() => User, user => user.friendships)
    public users: User[]
}