import { Entity, Column, PrimaryColumn, JoinColumn, CreateDateColumn, PrimaryGeneratedColumn, ManyToOne, OneToOne } from "typeorm";
import { ChannelMembership } from './channel-membership.entity'

@Entity()
export class ChannelTimeout {

  @PrimaryGeneratedColumn('uuid')
  id: string

  @OneToOne(() => ChannelMembership, mem => mem.timeout)
  @JoinColumn()
  membership: ChannelMembership

  @Column()
  membershipId: string

  @CreateDateColumn()
  start: Date

  @Column()
  end: Date

}
