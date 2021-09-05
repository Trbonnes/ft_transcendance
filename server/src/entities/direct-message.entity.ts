
import {
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from './user.entity';
import { DirectChannel } from './direct-channel.entity'

@Entity()
export class DirectMessage {
  @PrimaryGeneratedColumn('uuid') // generates unique id for each game
  id: string;

  @CreateDateColumn()
  createdDate: Date;

  @Column()
  content: string;

  @ManyToOne(() => User)
  @JoinColumn()
  sender: User;

  @Column()
  senderId: string;

  @ManyToOne(() => DirectChannel, (channel) => channel.messages, { onDelete: 'CASCADE' })
  @JoinColumn()
  channel: DirectChannel;

  @Column()
  channelId: string;
}
