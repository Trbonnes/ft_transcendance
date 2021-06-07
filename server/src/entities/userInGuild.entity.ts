import { PrimaryGeneratedColumn, Column, UpdateDateColumn, CreateDateColumn, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class UserInGuild {

    @PrimaryColumn() // generates unique id for each user
    userId: string

    @Column()
    guildId: string
    
    @Column()
    isOwner: boolean

    @Column()
    isOfficer: boolean
}