import { PrimaryGeneratedColumn, Column, UpdateDateColumn, CreateDateColumn, Entity } from 'typeorm';

@Entity()
export class UserInGuild {

    @PrimaryGeneratedColumn('uuid') // generates unique id for each user
    id: string

    @Column()
    guildId: string
    
    @Column()
    isOwner: boolean

    @Column()
    isOfficer: boolean
}