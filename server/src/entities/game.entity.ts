import { PrimaryGeneratedColumn, Column, UpdateDateColumn, CreateDateColumn, Entity } from 'typeorm';

@Entity()
export class Game {

    @PrimaryGeneratedColumn('uuid') // generates unique id for each game
    id: string;

    @Column()
    status: boolean // 0: ongoing 1: finished

    @Column()
    player1: string // User id

    @Column()
	player2: string
	
	@Column()
	winner: string

	@CreateDateColumn()
	date: Date
}