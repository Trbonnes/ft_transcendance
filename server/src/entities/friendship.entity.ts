import { PrimaryGeneratedColumn, Column, UpdateDateColumn, CreateDateColumn, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class Friendship {
	@PrimaryColumn()
	status: boolean // 0: pending 1:active

    @Column()
	userId1: string

    @Column()
	userId2: string

	
}