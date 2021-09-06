
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
  async joinChannel(userId: string) {
    console.log("Calling joinChannel")
    return $axios.$post<DirectChannel>(`/direct-channel/${userId}`)
  }

  @Action
  async searchUser(username: string) {
    try {
      return await $axios.$get(`/users/search/${username}`)
    } catch (error: any) {
      //TODO error handling
    }
  }

  @Action
  async join(userId: string) {
    const sock = getSocket()
    sock.emit('joinDirect', userId)
  }

  @Action history(userId: string) {
    let data = $axios.$get(`/direct-channel/${userId}/history`)
    console.log("History ", data)
  }

  @Mutation
  setChannels(data: DirectChannel[]) {
    console.log("Here we are in setChannel")
    console.log(data)
    const keys = Object.keys(this.channels)
    for (let i = 0; i < keys.length; i++) {
      Vue.delete(this.channels, keys[i])
    }
    for (let i = 0; i < data.length; i++) {
      const c = data[i];
      Vue.set(this.channels, c.user.id, c)
    }
    console.log(this.channels)
  }

  @Mutation
  setOne(data: DirectChannel) {
    Vue.set(this.channels, data.id, data)
  }

  get all() {
    return this.channels
  }
}
