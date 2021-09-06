import {
  PrimaryGeneratedColumn,
  PrimaryColumn,
  Column,
  JoinColumn,
  Entity,
  ManyToOne,
  OneToMany,
  Unique,
  Index
} from 'typeorm';
import { User } from './user.entity';
import { DirectMessage } from './direct-message.entity'

@Entity()
export class DirectChannel {

  @PrimaryGeneratedColumn('uuid') // generates unique id for each game
  id: string;

  @ManyToOne(() => User, (user) => user.direct)
  @JoinColumn()
  user1: User;

  @Column()
  user1Id: string;

  @ManyToOne(() => User, (user) => user.direct)
  @JoinColumn()
  user2: User;

  @Column()
  user2Id: string;

  @OneToMany(() => DirectMessage, (msg) => msg.channel)
  messages: DirectMessage[];
}
