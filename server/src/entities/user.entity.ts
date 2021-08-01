import { PrimaryGeneratedColumn, Column, UpdateDateColumn, CreateDateColumn, Entity, OneToMany, ManyToMany, OneToOne, JoinTable, JoinColumn } from 'typeorm';
import { Friendship } from './friendship.entity';
import { Game } from './game.entity';
import { Channel } from './channel.entity';

@Entity()
export class User {

    @PrimaryGeneratedColumn('uuid') // generates unique id for each user
	id: string
	
	@Column({ unique: true })
	email: string

	@Column()
	password: string;

	@Column({ unique: true })
	name: string
	@Column()
	avatar: string = "" // link to the image

  	@Column()
	isActive: boolean = false

	@Column()
	inGame: boolean = false

	@Column({default: false})
	twoFactor: boolean

	@Column({nullable: true})
	twoFactorToken: string

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

	@ManyToMany(() => Friendship, friendship => friendship.users)
	@JoinTable()
	public friendships: Friendship[]

	@ManyToMany(() => Channel, channel => channel.members)
	@JoinTable()
	public channels: Channel[]
	
}
