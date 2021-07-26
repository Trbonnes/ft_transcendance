import { PrimaryGeneratedColumn, Column, UpdateDateColumn, CreateDateColumn, Entity, ManyToMany } from 'typeorm';
import { User } from './user.entity'

@Entity()
export class Channel {

    @PrimaryGeneratedColumn('uuid') // generates unique id for each user
    id: string

    @Column()
    password: string = "" //if not set channel is public

	  @CreateDateColumn()
	  createdDate: Date

	  @UpdateDateColumn()
    lastUpdated: Date

    @ManyToMany(() => User, user => user.channels)
    members : User[]
}
