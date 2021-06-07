import { PrimaryGeneratedColumn, Column, UpdateDateColumn, CreateDateColumn, Entity } from 'typeorm';

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
    owner: string //User id

    @Column()
    points: number

    @Column()
    war: boolean //at war or not

	@CreateDateColumn()
	createdDate: Date

	@UpdateDateColumn()
	lastUpdated: Date
}