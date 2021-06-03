import { PrimaryGeneratedColumn, Column, UpdateDateColumn, CreateDateColumn, Entity } from 'typeorm';

@Entity()
export class User {

    @PrimaryGeneratedColumn('uuid') // generates unique id for each user
    id: string;

    @Column()
    firstName: string;

    @Column()
    lastName: string;

    @Column()
	isActive: boolean;
	
	@Column()
	email: string;

	@CreateDateColumn()
	createdDate: Date;

	@UpdateDateColumn()
	lastUpdated: Date;
	// @Column()
	// guild: string;
}