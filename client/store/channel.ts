import { Module, VuexModule, Mutation, Action } from 'vuex-module-decorators'
import { Channel, CreateChannelDto } from '~/utils/types/channel'
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
