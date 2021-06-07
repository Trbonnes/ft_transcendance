import { PrimaryGeneratedColumn, Column, UpdateDateColumn, CreateDateColumn, Entity, OneToMany, OneToOne, ManyToMany } from 'typeorm';
import { UserInChatRoom } from './userInChatRoom.entity';

@Entity()
export class ChatRoom {

    @PrimaryGeneratedColumn('uuid') // generates unique id for each user
    id: string

    @Column()
    password: string = "" //if not set channel is public

	@CreateDateColumn()
	createdDate: Date

	@UpdateDateColumn()
    lastUpdated: Date

    @OneToMany(() => UserInChatRoom, userInChatRoom => userInChatRoom.chatRoom)
    public usersInChatRoom: UserInChatRoom[]

    public get owner(): UserInChatRoom | null {
        return this.usersInChatRoom.find(userInChatRoom => userInChatRoom.isOwner)
    }

    public get administrators(): UserInChatRoom[] {
        return this.usersInChatRoom.filter(userInChatRoom => userInChatRoom.isAdministrator)
    }

}