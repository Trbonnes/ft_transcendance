import { PrimaryGeneratedColumn, Column, UpdateDateColumn, CreateDateColumn, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class UserInChatRoom {

    @PrimaryColumn('uuid') // generates unique id for each user
    userId: string

    @Column()
    chatId: string
    
    @Column()
    isOwner: boolean

    @Column()
    isAdministrator: boolean
}