
import { Module, VuexModule, Mutation, Action } from 'vuex-module-decorators'
import { Message, DirectChannel } from '~/utils/types'
import { $axios } from '~/utils/api'
import { getSocket } from '~/store/plugins/websocket'
import Vue from 'vue'

@Module({ namespaced: true })
export default class DirectChannelModule extends VuexModule {

  public channels: DirectChannel[] = []
  public gameNotifications : { userId : string, link : string }[] = []

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
      this.context.commit('pushMessage', msg)
    } catch (err: any) {
    }
  }

  @Action
  async sendInvitation(payload: { userId : string, link : string})
  {
    try {
      let sock = getSocket()
      sock.emit("invitation", payload)
    } catch (error) {
    }
  }
  
  @Action
  async invitation(payload: { userId : string, link : string})
  {
    try {
      this.context.commit('pushGameNotification', { userId : payload.userId, link : payload.link })
    } catch (error) {
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
      // console.log(error) TODO error handling ? 
    }
  }

  @Mutation
  pushGameNotification(data : { userId : string, link : string })
  {
    this.gameNotifications.push(data)
  }

  @Mutation
  shiftGameNotification()
  {
    this.gameNotifications.shift()
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
  
  get getGameNotifications()
  {
    return this.gameNotifications
  }
}
