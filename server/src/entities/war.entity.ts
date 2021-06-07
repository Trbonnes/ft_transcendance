import { PrimaryGeneratedColumn, Column, UpdateDateColumn, CreateDateColumn, Entity, ManyToMany, OneToOne, JoinColumn } from 'typeorm';
import { Guild } from './guild.entity';

@Entity()
export class War {

    @PrimaryGeneratedColumn('uuid') // generates unique id for each game
    id: string;

    @Column()
    status: boolean // 0: ongoing 1: finished

	@ManyToMany(() => Guild, guild => guild.wars)
    public guilds: Guild[]

    @OneToOne(() => Guild)
    @JoinColumn()
	public winner: Guild

	@CreateDateColumn()
    date: Date
    
}