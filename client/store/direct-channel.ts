
import { Module, VuexModule, Mutation, Action } from 'vuex-module-decorators'
import { Message, DirectChannel } from '~/utils/types'
import { $axios } from '~/utils/api'
import { getSocket } from '~/store/plugins/websocket'
import Vue from 'vue'

interface ChanMap {
  [key: string]: DirectChannel
}

@Module({ namespaced: true })
export default class DirectChannelModule extends VuexModule {

  public channels: ChanMap = {}

  @Action
  async fetchAll() {
    try {
      let data = await $axios.$get<DirectChannel[]>('/direct-channel/all')
      console.log("This is the channels fetched", data)
      this.context.commit('setChannels', data)
    }
    catch (error: any) {
      // TODO error handling component
    }

  }

  @Action
  async fetchOne(id: string) {
    try {
      let data = await $axios.$get<DirectChannel>(`/direct-channel/${id}`)
      this.context.commit('setChannels', data)
    }
    catch (error: any) {
      // TODO error handling component
    }
  }

  @Action
  async joinDirectChannel(userId: string) {
    try {
      let data = await $axios.$post<DirectChannel>(`/direct-channel/${userId}`)
      this.context.commit('setOne', data)
    } catch (error) {
      // TODO error handling component
    }
  }

  @Action
  async searchUser(username: string) {
    try {
      return await $axios.$get(`/users/search/${username}`)
    } catch (error: any) {
      //TODO error handling
    }
  }

  @Mutation
  setChannels(data: DirectChannel[]) {
    const keys = Object.keys(this.channels)
    for (let i = 0; i < keys.length; i++) {
      Vue.delete(this.channels, keys[i])
    }
    for (let i = 0; i < data.length; i++) {
      const c = data[i];
      Vue.set(this.channels, c.id, c)
    }
  }

  @Mutation
  setOne(data: DirectChannel) {
    Vue.set(this.channels, data.id, data)
  }

  get all() {
    return this.channels
  }
}
