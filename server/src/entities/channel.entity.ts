import { PrimaryGeneratedColumn, Column, UpdateDateColumn, CreateDateColumn, Entity, OneToMany, OneToOne, ManyToMany } from 'typeorm';
import { UserInChannel } from './userInChatRoom.entity';

@Entity()
export class Channel {

    @PrimaryGeneratedColumn('uuid') // generates unique id for each user
    id: string

    @Column()
    password: string = "" //if not set channel is public

	  @CreateDateColumn()
	  createdDate: Date

	  @UpdateDateColumn()
    lastUpdated: Date

    @OneToMany(() => UserInChannel, userInChannel => userInChannel.chatRoom)
    public usersInChatRoom: UserInChannel[]

    public get owner(): UserInChannel | null {
        return this.usersInChatRoom.find(userInChannel => userInChannel.isOwner)
    }
}
