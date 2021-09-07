
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
  async sendMessage(payload: { userId: string; content: string }) {
    try {
      const socket = getSocket()
      socket.emit("sendDirect", payload)
    } catch (error: any) {
      // TODO error handling
    }
  }

  @Action
  async history(userId: string) {
    try {
      let data = await $axios.$get(`/direct-channel/${userId}/history`)
      this.context.commit('setMessages', { userId: userId, data: data })
      console.log("History ", data)
    } catch (error: any) {
      // TODO error handling
    }
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
      console.log("Here is the element ", c)
      console.log("Here is the id ", c.id)
      Vue.set(this.channels, c.id, c)
    }
    console.log(this.channels)
  }

  @Mutation
  setMessages(payload: { userId: string; data: Message[] }) {
    let c = this.channels[payload.userId]
    if (c) {
      Vue.set(this.channels[payload.userId], "messages", payload.data)
    }
  }

  @Action
  message(msg: Message) {
    try {
      console.log("Pushing new message")
      this.context.commit('pushMessage', {
        userId: msg.senderId,
        message: msg,
      })
    } catch (err: any) {
      console.log(err)
      // TODO error handlign properly
    }
  }

  @Mutation
  pushMessage(payload: { userId: string; message: Message }) {
    try {
      let c = this.channels[payload.userId]
      if (c)
        c.messages.push(payload.message)
      Vue.set(this.channels, payload.userId, c) // TODO not optimized
    } catch (error) {
    }
  }

  @Mutation
  setOne(data: DirectChannel) {
    Vue.set(this.channels, data.id, data)
  }

  get all() {
    return this.channels
  }

  get messages() {
    return (id: string) => {
      console.log("Channel list ")
      console.log(this.channels)
      let c = this.channels[id]
      if (c && c.messages) {
        return c.messages
      }
      return []
    }
  }
}
