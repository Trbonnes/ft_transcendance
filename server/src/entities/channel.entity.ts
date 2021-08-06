import {
  PrimaryGeneratedColumn,
  Column,
  UpdateDateColumn,
  CreateDateColumn,
  Entity,
  ManyToMany,
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

  @ManyToMany(() => User, (user) => user.channels)
  members: User[];
}
