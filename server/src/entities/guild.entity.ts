import { PrimaryGeneratedColumn, Column, UpdateDateColumn, CreateDateColumn, Entity, OneToMany, OneToOne, ManyToMany, JoinColumn, JoinTable } from 'typeorm';
import { UserInGuild } from './userInGuild.entity';
import { War } from './war.entity';

@Entity()
export class Guild {

    @PrimaryGeneratedColumn('uuid') // generates unique id for each user
    id: string;

    @Column()
    name: string 

    @Column()
    tag: string //5 letters max

    @Column()
    description: string

    @Column()
    points: number

    @Column()
    war: boolean //at war or not

	@CreateDateColumn()
	createdDate: Date

	@UpdateDateColumn()
    lastUpdated: Date
    
    @OneToMany(() => UserInGuild, userInGuild => userInGuild.user)
    public usersInGuild: UserInGuild[]

    public get owner(): UserInGuild | null {
        return this.usersInGuild.find(userInGuild => userInGuild.isOwner)
    }

    public get officers(): UserInGuild[] {
        return this.usersInGuild.filter(userInGuild => userInGuild.isOfficer)
    }

    @ManyToMany(() => War, war => war.guilds)
	@JoinTable()
	public wars: War[]
}