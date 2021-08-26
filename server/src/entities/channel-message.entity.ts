import {
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  Entity,
  ManyToMany,
  OneToMany,
  ManyToOne,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { Channel } from './channel.entity';
import { User } from './user.entity';

@Entity()
export class ChannelMessage {
  @PrimaryGeneratedColumn('uuid') // generates unique id for each game
  id: string;

  @CreateDateColumn()
  createdDate: Date;

  @Column()
  content: string;

  @ManyToOne((type) => User)
  @JoinColumn()
  sender: User;

  @Column()
  senderId: string;

  @ManyToOne(() => Channel, (channel) => channel.messages)
  @JoinColumn()
  channel: Channel;

  @Column()
  channelId: string;
}
