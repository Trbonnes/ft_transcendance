import {
  PrimaryGeneratedColumn,
  Column,
  UpdateDateColumn,
  CreateDateColumn,
  Entity,
  OneToMany,
  ManyToMany,
  ManyToOne,
  OneToOne,
  JoinTable,
  JoinColumn,
} from 'typeorm';
import { Game } from './game.entity';
import { Channel } from './channel.entity';
import { FriendRequest } from './friend-request.entity';
import { ChannelMembership } from './channel-membership.entity'
import { DirectChannel } from './direct-channel.entity'

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid') // generates unique id for each user
  id: string;

  @Column({ unique: true })
  email: string;

  @Column({ unique: true })
  login: string;

  @Column()
  firstName: string;

  @Column({ unique: true })
  displayName: string;

  @Column()
  role: string = 'user';

  @Column()
  banned: boolean = false

  @Column()
  avatar: string = ''; // link to the image

  @Column()
  defaultAvatar: string = ''; // link to default 42 intra avatar

  @Column()
  avatarFileName: string = ''; // custom avatar file name

  @Column()
  isActive: boolean = false;

  @Column()
  inGame: boolean = false;

  @Column({ default: false })
  twoFactor: boolean;

  @Column({ nullable: true })
  twoFactorCode: string;

  @Column()
  victory: number = 0;

  @Column()
  defeat: number = 0;

  @Column()
  level: number = 0;

  @CreateDateColumn()
  createdDate: Date;

  @UpdateDateColumn()
  lastUpdated: Date;

  @Column('text', { array: true, default: '{}' })
  public friends: string[];

  @OneToMany(() => ChannelMembership, chan => chan.user)
  memberships: ChannelMembership[]

  @OneToMany(() => ChannelMembership, chan => chan.user)
  direct: DirectChannel[]

  @OneToMany(() => User, user => user.blocker)
  @JoinTable()
  blockedUsers: User[]

  @ManyToOne(() => User, user => user.blockedUsers)
  blocker: User

  @Column({ default: '' })
  game_id: string;
}
