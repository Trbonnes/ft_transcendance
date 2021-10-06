import { Module, VuexModule, Mutation, Action } from 'vuex-module-decorators'
import { Channel, CreateMessageDto, CreateChannelDto, Message } from '~/utils/types'
import { $axios } from '~/utils/api'
import { getSocket } from '~/store/plugins/websocket'
import Vue from 'vue'

interface ChanMap {
  [key: string]: Channel
}

@Module({ namespaced: true }) // since we're using a custom store this is important to make it namespaced, so we can use "chat/someAction" later
export default class ChannelModule extends VuexModule {
  public channels: ChanMap = {}

  @Action
  async fetchAll() {

    if(!getSocket().io.opts.extraHeaders)
      return

    try {
      const data: Channel[] = await $axios.$get<Channel[]>('/channel/all')
      this.context.commit('setChannels', data)
    } catch (error: any) {
      // TODO proper error handling
      // console.log(error.response.status)
    }
  }

  @Action
  async fetchOne(channelId: string) {
    try {
      const data = await $axios.$get<Channel>(`/channel/${channelId}`)
      this.context.commit('setOne', data)
    } catch (error) {
      // TODO error handling 
    }
  }

  @Action
  create(channel: CreateChannelDto) {
    return $axios.$post<Channel>('/channel/create', channel)
  }

  @Action
  async update(data: { channelId: string; channelName: string; isPrivate: boolean; password: string }) {
    return $axios.$post<Channel>(`/channel/${data.channelId}/update`,
      {
        channelName: data.channelName,
        isPrivate: data.isPrivate,
        newPassword: data.password
      })
  }

  @Action
  async getMessages(channelId: string) {
    try {
      const data = await $axios.$get<Message[]>(`/channel/${channelId}/history`)
      this.context.commit("setMessages", { channelId, data })
    }
    catch (error: any) {
      // TODO error handling
    }
  }

  @Action
  async getMembers(channelId: string) {
    try {
      const data = await $axios.$get<any[]>(`/channel/${channelId}/members`) // add legit use type maybe
      this.context.commit("setMembers", { channelId, data })
    } catch (error: any) {
      // TODO error handling
    }
  }

  @Action
  async getConvoMembers(channelId: string) {
    try {
      const data = await $axios.$get<any[]>(`/channel/${channelId}/convoMembers`)
      this.context.commit("setConvoMembers", { channelId, data })
    } catch (error: any) {
      // TODO error handling
    }
  }

  @Action
  joinChannel(channelId: string) {
    const sock = getSocket()
    sock.emit('joinChannel', channelId)
  }

  @Action
  sendMessage(dto: CreateMessageDto) {
    const sock = getSocket()

    sock.emit('channelMessage', dto)
  }

  @Action
  message(msg: Message) {
    try {
      this.context.commit('pushMessage', {
        channelId: msg.channelId,
        message: msg,
      })
    } catch (err: any) {
      // TODO error handlign properly
    }
  }

  @Mutation
  setMessages(payload: { channelId: string; data: Message[] }) {
    let c = this.channels[payload.channelId]
    if (c) {
      Vue.set(this.channels[payload.channelId], "messages", payload.data)
    }
  }

  @Mutation
  setMembers(payload: { channelId: string; data: any[] }) {
    let c = this.channels[payload.channelId]
    if (c) {
      Vue.set(this.channels[payload.channelId], "members", payload.data)
    }
  }

  @Mutation
  setConvoMembers(payload: { channelId: string; data: any[] }) {
    let c = this.channels[payload.channelId]
    if (c) {
      Vue.set(this.channels[payload.channelId], "convoMembers", payload.data)
    }
  }

  @Mutation
  setChannels(data: Channel[]) {
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
  setOne(data: Channel) {
    Vue.set(this.channels, data.id, data)
  }

  @Mutation
  pushChannel(data: Channel) {
    Vue.set(this.channels, data.id, data)
  }

  @Mutation
  updateChannel(channel: Channel) {
    Vue.set(this.channels, channel.id, channel)
  }

  @Mutation
  pushMessage(payload: { channelId: string; message: Message }) {
    try {
      let c = this.channels[payload.channelId]
      if (c)
        c.messages.push(payload.message)
      Vue.set(this.channels, payload.channelId, c)
    } catch (error) {
    }
  }

  get all() {
    return this.channels
  }

  get messages() {
    return (id: string) => {
      let c = this.channels[id]
      if (c && c.messages) {
        return c.messages
      }
      return []
    }
  }

  get members() {
    return (id: string) => {
      let c = this.channels[id]
      if (c && c.members) {
        return c.members
      }
      return []
    }
  }

  get convoMembers() {
    return (id: string) => {
      let c = this.channels[id]
      if (c && c.convoMembers) {
        return c.convoMembers
      }
      return []
    }
  }

  get getOne() {
    return (id: string) => {
      return this.channels[id]
    }
  }
}
