import {
  PrimaryGeneratedColumn,
  PrimaryColumn,
  Column,
  JoinColumn,
  Entity,
  OneToOne,
  OneToMany,
  Unique
} from 'typeorm';
import { User } from './user.entity';
import { DirectMessage } from './direct-message.entity'

@Entity()
@Unique("pair", ["user1Id", "user2Id"])
export class DirectChannel {

  @PrimaryGeneratedColumn('uuid') // generates unique id for each game
  id: string;

  @Column()
  lastMessageUpdate: Date;

  @OneToOne(() => User)
  @JoinColumn()
  user1: User;

  @Column()
  user1Id: string;

  @OneToOne(() => User)
  @JoinColumn()
  user2: User;

  @Column()
  user2Id: string;

  @OneToMany(() => DirectMessage, (msg) => msg.channel)
  messages: DirectMessage[];
}
