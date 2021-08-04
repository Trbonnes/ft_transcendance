import { Module, VuexModule, Mutation, Action } from 'vuex-module-decorators'
import { Channel, CreateChannelDto } from '~/utils/types/channel'
import { $axios } from '~/utils/api'

@Module({ namespaced: true }) // since we're using a custom store this is important to make it namespaced, so we can use "chat/someAction" later
export default class ChannelModule extends VuexModule {
  private channelList: Channel[] = []

  @Action
  async fetchAll() {
    console.log('Fetching all the channels')
    try {
      console.log($axios)
      const data = await $axios.$get<Channel[]>('/channel/all')
    } catch (error: any) {
      console.log(error)
    }
    console.log('Data fetched')
    // this.context.commit('setChannelList', data)
  }

  @Action
  async create(channel: CreateChannelDto) {
    const data = await $axios.$post<Channel>('/channel/create', channel)
    // this.context.commit('pushChannel', data)
  }

  @Mutation
  setChannelList(data: Channel[]) {
    this.channelList = data
  }

  @Mutation
  pushChannel(data: Channel) {
    this.channelList.push(data)
  }

  get all() {
    return this.channelList
  }
}
