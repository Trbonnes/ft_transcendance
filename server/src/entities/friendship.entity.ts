import { PrimaryGeneratedColumn, Column, UpdateDateColumn, CreateDateColumn, Entity } from 'typeorm';

@Entity()
export class Friendship {

    @Column()
	userId1: string

    @Column()
	userId2: string

	@Column()
	status: boolean // 0: pending 1:active
	
}