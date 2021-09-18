import { Entity, Column, OneToOne, ManyToOne, JoinColumn, PrimaryGeneratedColumn } from "typeorm";
import { Channel } from './channel.entity'
import { User } from './user.entity'
import { ChannelTimeout } from './channel-timeout.entity'

@Entity()
export class ChannelMembership {

  @PrimaryGeneratedColumn('uuid')
  id: string // TODO manage to make a compsite key

  @ManyToOne(() => User, user => user.memberships, { onDelete: 'CASCADE' })
  user: User

  @Column()
  userId: string

  @ManyToOne(() => Channel, chan => chan.members, { onDelete: 'CASCADE' })
  channel: Channel;

  @Column()
  channelId: string

  @Column()
  isAdmin: boolean

  @OneToOne(() => ChannelTimeout, timeout => timeout.membership, { onDelete: 'CASCADE' })
  timeout: ChannelTimeout

}
