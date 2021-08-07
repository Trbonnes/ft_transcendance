import {
  PrimaryGeneratedColumn,
  Column,
  JoinColumn,
  UpdateDateColumn,
  CreateDateColumn,
  Entity,
  ManyToMany,
  OneToOne,
  ManyToOne,
} from 'typeorm';
import { User } from './user.entity';

@Entity()
export class Channel {
  @PrimaryGeneratedColumn('uuid') // generates unique id for each channel
  id: string;

  @Column()
  isPublic: boolean = true;

  @Column()
  isSticky: boolean = false;

  @Column({ unique: true })
  name: string = '';

  @Column()
  password: string = '';

  @CreateDateColumn()
  createdDate: Date;

  @UpdateDateColumn()
  lastUpdated: Date;

  @ManyToOne(() => User)
  @JoinColumn()
  owner: User;

  @ManyToMany(() => User, (user) => user.channels)
  members: User[];
}
