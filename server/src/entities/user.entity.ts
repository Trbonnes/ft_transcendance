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
	role: string = "user"

	@Column()
	avatar: string = "" // link to the image

	@Column()
	defaultAvatar: string = "" // link to default 42 intra avatar

	@Column()
	avatarFileName: string = "" // custom avatar file name

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
	level: number = 0

	@CreateDateColumn()
	createdDate: Date

	@UpdateDateColumn()
	lastUpdated: Date
	
	@Column("text", {array: true, default: '{}'})
	public friends: string[]

	@ManyToMany(() => Game, game => game.players)
	@JoinTable()
	public games: Game[]

	@ManyToMany(() => Channel, channel => channel.members)
	@JoinTable()
	public channels: Channel[]
	
}
