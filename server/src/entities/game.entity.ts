import { PrimaryGeneratedColumn, Column, UpdateDateColumn, CreateDateColumn, Entity, ManyToMany, OneToMany, ManyToOne, OneToOne, JoinColumn } from 'typeorm';
import { User } from './user.entity';

@Entity()
export class Game {

    @PrimaryGeneratedColumn('uuid') // generates unique id for each game
    id: string;

    @Column()
    status: boolean // 0: ongoing 1: finished

    @ManyToMany(() => User, user => user.games)
    public players: User[]
	
    @OneToOne(() => User)
    @JoinColumn()
	public winner: User

	@CreateDateColumn()
    date: Date
}