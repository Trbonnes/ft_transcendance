import { PrimaryGeneratedColumn, Column, UpdateDateColumn, CreateDateColumn, Entity } from 'typeorm';

@Entity()
export class ChatRoom {

    @PrimaryGeneratedColumn('uuid') // generates unique id for each user
    id: string

    @Column()
    password: string = "" //if not set channel is public

    @Column()
    owner: string //User id

	@CreateDateColumn()
	createdDate: Date

	@UpdateDateColumn()
	lastUpdated: Date
}