import { PrimaryGeneratedColumn, Column, UpdateDateColumn, CreateDateColumn, Entity, PrimaryColumn, ManyToOne } from 'typeorm';
import { ChatRoom } from './chatRoom.entity';
import { User } from './user.entity';

@Entity()
export class UserInChatRoom {

    @PrimaryGeneratedColumn('uuid') // generates unique id for each user
    id: string;

    @ManyToOne(() => User, user => user.userInChatRoom)
    public user: User

    @ManyToOne(() => ChatRoom, chatRoom => chatRoom.usersInChatRoom)
    public chatRoom: ChatRoom
    
    @Column()
    isOwner: boolean

    @Column()
    isAdministrator: boolean

}