import {
  PrimaryGeneratedColumn,
  Column,
  JoinColumn,
  UpdateDateColumn,
  CreateDateColumn,
  Entity,
  ManyToMany,
  OneToOne,
  OneToMany,
  ManyToOne,
  JoinTable,
} from 'typeorm';
import { User } from './user.entity';
import { ChannelMessage } from './channel-message.entity';

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

  @Column({ select: false })
  password?: string = '';

  @CreateDateColumn()
  createdDate: Date;

  @UpdateDateColumn()
  lastUpdated: Date;

  @ManyToOne(() => User)
  @JoinColumn()
  owner: User;

  @OneToMany(() => ChannelMessage, (msg) => msg.channel)
  messages: ChannelMessage[];

  @ManyToMany(() => User)
  @JoinTable()
  members: User[];
}
