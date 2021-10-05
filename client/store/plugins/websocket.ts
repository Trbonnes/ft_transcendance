// MIght add type check from vuex and vuex-decorator
import os from 'os'
import { io, Socket } from 'socket.io-client'

let socket: Socket

export function createWebSocketPlugin(store: any) {
  socket = io('http://' + os.hostname() + ':3000/chat', {
    forceNew: true,
    autoConnect: false,
    transportOptions: {
      cors: {
        origin: '*',
      },
      transports: ['websockets'],
    },
  })


  socket.on('connect', () => {
  })
  socket.on('disconnect', (reason) => {
  })
  socket.on('connect_error', (err) => {
    // console.log(`connect_error due to ${err.message}`)
  })
  socket.on('channel/message', (data) => {
    store.dispatch('channel/message', data)
  })
  socket.on('directChannel/directMessage', (data) => {
    store.dispatch('directChannel/message', data)
  })
  socket.on('directChannel/invitation', (data) => {
    store.dispatch('directChannel/invitation', data)
  })
  socket.on('channel/memberUpdate', (channelId : string) => {
    console.log("Member update detected")
    store.dispatch('channel/getMembers', channelId)
  })
  socket.on('channel/channelUpdate', (channelId : string) => {
    store.dispatch('channel/fetchOne', channelId)
  })
  socket.on('channel/updateList', (data) => {
    store.dispatch('channel/fetchAll', data)
  })
  store.subscribe((mutation: any) => { })
}

export function getSocket(): Socket {
  return socket
}

export default { createWebSocketPlugin, getSocket }
