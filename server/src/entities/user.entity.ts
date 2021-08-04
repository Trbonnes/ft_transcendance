import { PrimaryGeneratedColumn, Column, UpdateDateColumn, CreateDateColumn, Entity, OneToMany, ManyToMany, OneToOne, JoinTable, JoinColumn } from 'typeorm';
import { Game } from './game.entity';
import { Channel } from './channel.entity';
import { FriendRequest } from './friend-request.entity';

@Entity()
export class User {

    @PrimaryGeneratedColumn('uuid') // generates unique id for each user
	id: string
	
	@Column({ unique: true })
	email: string

	@Column({ unique: true})
	login: string

	@Column()
	firstName: string

	@Column({ unique: true })
	displayName: string

	@Column()
	avatar: string = "" // link to the image

  	@Column()
	isActive: boolean = false

	@Column()
	inGame: boolean = false

	@Column({default: false})
	twoFactor: boolean

	@Column({nullable: true})
	twoFactorCode: string

	@Column()
	victory: number = 0

	@Column()
	defeat: number = 0

	@Column()
	ladder: number = 0

	@CreateDateColumn()
	createdDate: Date

	@UpdateDateColumn()
	lastUpdated: Date

	@ManyToMany(() => Game, game => game.players)
	@JoinTable()
	public games: Game[]

	@ManyToMany(() => User, user => user.friends)
	@JoinTable()
	public friends: User[]

	@ManyToMany(() => Channel, channel => channel.members)
	@JoinTable()
	public channels: Channel[]
	
}
