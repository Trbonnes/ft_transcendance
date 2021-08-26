import { Module, VuexModule, Mutation, Action } from 'vuex-module-decorators'
import { Channel, CreateChannelDto } from '~/utils/types/channel'
import { Message } from '~/utils/types/message'
import { $axios } from '~/utils/api'

@Module({ namespaced: true }) // since we're using a custom store this is important to make it namespaced, so we can use "chat/someAction" later
export default class ChannelModule extends VuexModule {
  public channelList: Channel[] = []

  @Action
  async fetchAll() {
    console.log('Fetching all the channels')
    let data: Channel[]
    try {
      data = await $axios.$get<Channel[]>('/channel/all')
      this.context.commit('setChannelList', data)
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
  setChannelList(data: Channel[]) {
    this.channelList = data
  }

  @Mutation
  pushChannel(data: Channel) {
    this.channelList.push(data)
  }

  @Mutation
  pushMessage({ channelId, message }) {
    console.log('A new message has been received !')

    this.channelList.forEach((channel) => {
      // TODO maybe change it to a dictionnary instand of a list to reduce complexity
      if (channel.id === channelId) {
        console.log('Actually found a channel with some stuff in it')
        console.log(channel)

        channel.messages.push(message)
      }
    })
  }

  get all() {
    return this.channelList
  }

  get getOne() {
    return (id: string) => {
      for (let i = 0; i < this.channelList.length; i++) {
        const element = this.channelList[i]
        if (element.id === id) return element
      }
    }
  }
}
