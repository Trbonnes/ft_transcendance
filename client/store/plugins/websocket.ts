// MIght add type check from vuex and vuex-decorator
import os from 'os'
import { io, Socket } from 'socket.io-client'

let socket: Socket

export function createWebSocketPlugin(store: any) {
  console.log('Initializing the websocket ')
  console.log('Hostname: ' + os.hostname())
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
    console.log('We are connected to the backend !')
  })
  socket.on('disconnect', (reason) => {
    console.log('connection has been closed : ', reason)
  })
  socket.on('connect_error', (err) => {
    console.log(`connect_error due to ${err.message}`)
  })
  socket.on('channel/message', (data) => {
    console.log(data)
    store.dispatch('channel/message', data)
  })
  socket.on('directChannel/directMessage', (data) => {
    console.log(data)
    store.dispatch('directChannel/message', data)
  })
  store.subscribe((mutation: any) => { })
}

export function getSocket(): Socket {
  return socket
}

export default { createWebSocketPlugin, getSocket }
