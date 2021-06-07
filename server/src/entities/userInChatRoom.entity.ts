import { PrimaryGeneratedColumn, Column, UpdateDateColumn, CreateDateColumn, Entity } from 'typeorm';

@Entity()
export class UserInChatRoom {

    @PrimaryGeneratedColumn('uuid') // generates unique id for each user
    id: string

    @Column()
    chatId: string
    
    @Column()
    isOwner: boolean

    @Column()
    isAdministrator: boolean
}