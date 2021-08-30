import { Module, VuexModule, Mutation, Action } from 'vuex-module-decorators'
import { Channel, CreateChannelDto, Message } from '~/utils/types'
import { $axios } from '~/utils/api'

@Module({ namespaced: true }) // since we're using a custom store this is important to make it namespaced, so we can use "chat/someAction" later
export default class ChannelModule extends VuexModule {
  public channels = new Map<string, Channel>()

  @Action
  async fetchAll() {
    console.log('Fetching all the channels')
    let data: Channel[]
    try {
      data = await $axios.$get<Channel[]>('/channel/all')
      console.log(data)
      this.context.commit('setChannels', data)
    } catch (error: any) {
      // TODO proper error handling
    }
  }

  @Action
  create(channel: CreateChannelDto) {
    return $axios.$post<Channel>('/channel/create', channel)
  }

  @Action
  message(msg: Message) {
    try {
      this.context.commit('pushMessage', {
        channelId: msg.channelId,
        message: msg,
      })
    } catch (err: any) {
      console.log(err)
      console.log(msg)
      // TODO error handlign properly
    }
  }

  @Mutation
  setChannels(data: Channel[]) {
    this.channels.clear()
    let tmp = new Map<string, Channel>()
    for (let i = 0; i < data.length; i++) {
      const c = data[i];
      tmp.set(c.id, c)
    }
    this.channels = tmp
  }

  @Mutation
  pushChannel(data: Channel) {
    let copy = new Map(this.channels)
    copy.set(data.id, data)
    this.channels = copy
  }

  @Mutation
  pushMessage(payload: { channelId: string; message: Message }) {
    console.log('A new message has been received !')
    try {
      let c = this.channels.get(payload.channelId)
      if (c)
        c.messages.push(payload.message)
    } catch (error) {
    }
  }

  get all() {
    return this.channels
  }

  get getOne() {
    return (id: string) => {
      return this.channels.get(id)
    }
  }
}
