import { PrimaryGeneratedColumn, Column, UpdateDateColumn, CreateDateColumn, Entity, OneToMany, ManyToMany, OneToOne, JoinTable, JoinColumn } from 'typeorm';
import { Friendship } from './friendship.entity';
import { Game } from './game.entity';
import { UserInChatRoom } from './userInChatRoom.entity';

@Entity()
export class User {

    @PrimaryGeneratedColumn('uuid') // generates unique id for each user
	id: string
	
	@Column()
	email: string

	@Column()
	password: string;

    @Column()
	name: string
	
	@Column()
	avatar: string // link to the image

    @Column()
	isActive: boolean = false

	@Column()
	inGame: boolean = false

	@Column()
	guild: string = ""

	@Column()
	twoFactors: boolean = false

	@Column()
	victory: number = 0

	@Column()
	defeat: number = 0

	@Column()
	ladder: number = 0

	@Column()
	wonTournaments: number = 0

	@Column()
	isAdministrator: boolean = false

	@CreateDateColumn()
	createdDate: Date

	@UpdateDateColumn()
	lastUpdated: Date

	@ManyToMany(() => Game, game => game.players)
	@JoinTable()
	public games: Game[]

	@ManyToMany(() => Friendship, friendship => friendship.users)
	public friendships: Friendship[]

	@OneToMany(() => UserInChatRoom, userInChatRoom => userInChatRoom.user)
	public userInChatRoom: UserInChatRoom[]
	
}