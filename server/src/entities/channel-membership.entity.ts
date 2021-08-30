import { Entity, Column, ManyToOne, JoinColumn, PrimaryGeneratedColumn } from "typeorm";
import { Channel } from './channel.entity'
import { User } from './user.entity'

@Entity()
export class ChannelMembership {

  @PrimaryGeneratedColumn('uuid')
  id: string // TODO manage to make a compsite key

  @ManyToOne(() => User, user => user.memberships)
  user: User

  @Column()
  userId: string

  @ManyToOne(() => Channel, chan => chan.members)
  channel: Channel;

  @Column()
  channelId: string

  @Column()
  isAdmin: boolean

  @Column()
  isBanned: boolean
}
