import { PrimaryGeneratedColumn, Column, UpdateDateColumn, CreateDateColumn, Entity, PrimaryColumn, OneToOne, ManyToOne } from 'typeorm';
import { Guild } from './guild.entity';
import { User } from './user.entity';

@Entity()
export class UserInGuild {

    @PrimaryGeneratedColumn('uuid') // generates unique id for each user
    id: string;

    @OneToOne(() => User, user => user.userInGuild)
	public user: User

    @ManyToOne(() => Guild, guild => guild.usersInGuild)
    public guild: Guild
    
    @Column()
    isOwner: boolean

    @Column()
    isOfficer: boolean

}