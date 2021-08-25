import { PrimaryGeneratedColumn, Column, UpdateDateColumn, CreateDateColumn, Entity, ManyToMany, OneToMany, ManyToOne, OneToOne, JoinColumn } from 'typeorm';
import { User } from './user.entity';

@Entity()
export class Game {

    @PrimaryGeneratedColumn('uuid') // generates unique id for each game
    id: string;

    @Column()
    game_id: string;
    
    @Column()
    status: boolean // 0: ongoing 1: finished

    // @ManyToMany(() => User, user => user.games)
    // public players: User[]
	
    @Column({default: ""})
	public winner_id: string

    @Column({default: ""})
	public loser_id: string
    
	@CreateDateColumn()
    date: Date
}