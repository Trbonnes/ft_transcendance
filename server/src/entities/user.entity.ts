import { PrimaryGeneratedColumn, Column, UpdateDateColumn, CreateDateColumn, Entity } from 'typeorm';

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
	isActive: boolean

	@Column()
	inGame: boolean

	@Column()
	guild: string = ""

	@Column()
	twoFactors: boolean = false

	@Column()
	victory: number

	@Column()
	defeat: number

	@Column()
	ladder: number

	@Column()
	wonTournaments: number

	@Column()
	isAdministrator: boolean

	@CreateDateColumn()
	createdDate: Date

	@UpdateDateColumn()
	lastUpdated: Date
}