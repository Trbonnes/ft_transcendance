import { PrimaryGeneratedColumn, Column, UpdateDateColumn, CreateDateColumn, Entity } from 'typeorm';

@Entity()
export class War {

    @PrimaryGeneratedColumn('uuid') // generates unique id for each game
    id: string;

    @Column()
    status: boolean // 0: ongoing 1: finished

    @Column()
    guild1: string // Guild id

    @Column()
	guild2: string
	
	@Column()
	winner: string

	@CreateDateColumn()
	date: Date
}