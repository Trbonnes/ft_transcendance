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
    console.log('Fetching all the channels')
    try {
      const data: Channel[] = await $axios.$get<Channel[]>('/channel/all')
      console.log(data)
      this.context.commit('setChannels', data)
    } catch (error: any) {
      // TODO proper error handling
    }
  }

  @Action
  async fetchOne(channelId: string) {
    try {
      const data = await $axios.$get<Channel>(`/channel/${channelId}`)
      console.log("Here ios the single channel", data)
      this.context.commit('setOne')
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
      console.log("Changed messages")
    }
    catch (error: any) {
      console.log(error)
    }
  }

  @Action
  async getMembers(channelId: string) {
    try {
      const data = await $axios.$get<any[]>(`/channel/${channelId}/members`) // add legit use type maybe
      this.context.commit("setMembers", { channelId, data })
    } catch (error: any) {
      // TODO error handling
      console.log(error)
    }
  }

  @Action
  joinChannel(channelId: string) {
    const sock = getSocket()
    console.log(sock)
    sock.emit('joinChannel', channelId)
  }

  @Action
  sendMessage(dto: CreateMessageDto) {
    const sock = getSocket()
    console.log(sock)

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
      console.log(err)
      console.log(msg)
      // TODO error handlign properly
    }
  }

  @Mutation
  setMessages(payload: { channelId: string; data: Message[] }) {
    console.log("setMessages")
    let c = this.channels[payload.channelId]
    if (c) {
      Vue.set(this.channels[payload.channelId], "messages", payload.data)
    }
  }

  @Mutation
  setMembers(payload: { channelId: string; data: Message[] }) {
    console.log("setMembers")
    let c = this.channels[payload.channelId]
    if (c) {
      Vue.set(this.channels[payload.channelId], "members", payload.data)
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
    console.log("trying to set one here")
    Vue.set(this.channels, data.id, data)
    console.log(this.channels)
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
    console.log('A new message has been received !')
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
      console.log("Here we are")
      console.log(c)
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

  get getOne() {
    return (id: string) => {
      return this.channels[id]
    }
  }
}
