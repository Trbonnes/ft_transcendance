
import { Module, VuexModule, Mutation, Action } from 'vuex-module-decorators'
import { Message, DirectChannel } from '~/utils/types'
import { $axios } from '~/utils/api'
import { getSocket } from '~/store/plugins/websocket'
import Vue from 'vue'

@Module({ namespaced: true })
export default class DirectChannelModule extends VuexModule {

  public channels: DirectChannel[] = []
  public notifications : { [ channelId : string ] : number } = {}


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
      if (username === "")
        username = "0" // oscour je sais pas ce que je fais
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
  async history(channelId: string) {
    try {
      let data = await $axios.$get<Message[]>(`/direct-channel/${channelId}/history`)
      this.context.commit('setMessages', { channelId: channelId, data: data })
    } catch (error: any) {
      // TODO error handling
    }
  }

  @Action
  async message(msg: Message) {
    try {
      console.log("Pushing new message")
      this.context.commit('pushMessage', msg)
      this.context.commit('pushNotification', msg.channelId)
    } catch (err: any) {
      console.log(err)
      // TODO error handlign properly
    }
  }

  @Mutation
  setChannels(data: DirectChannel[]) {
    this.channels = []
    for (let i = 0; i < data.length; i++)
      this.channels.push(data[i])
  }

  @Mutation
  setMessages(payload: { channelId: string; data: Message[] }) {
    let c = this.channels.find(c => c.id === payload.channelId)
    if (c)
      Vue.set(c, "messages", payload.data)
  }

  @Mutation
  pushMessage(message: Message) {
    try {
      let c = this.channels.find(c => c.id === message.channelId)
      if (c)
        c.messages.push(message)
    } catch (error) {
      console.log(error)// TODO error handling ? 
    }
  }

  @Mutation
  pushNotification(channelId : string)
  {
    if (this.notifications[channelId])
      Vue.set(this.notifications, channelId, this.notifications.channelId + 1)
    else
      Vue.set(this.notifications, channelId, 0)
  }

  @Mutation
  setOne(data: DirectChannel) {
    Vue.set(this.channels, data.id, data)
  }

  get all() {
    return this.channels
  }
  
  get one()
  {
    return (channelId : string) => {
      return this.channels.find(c => c.id === channelId)
    }
  }

  get messages() {
    return (channelId: string) => {
      let c = this.channels.find(c => c.id === channelId)
      if (c && c.messages) {
        return c.messages
      }
      return []
    }
  }

  get user() {
    return (channelId: string) => {
      let c = this.channels.find(c => c.id === channelId)
      if (c)
        return c.user
    }
  }
}
