// MIght add type check from vuex and vuex-decorator
import os from 'os'
import { io, Socket } from 'socket.io-client'

let socket: Socket

function createWebSocketPlugin(store: any) {
  console.log('Initializing the websocket ')
  console.log('Hostname: ' + os.hostname())
  socket = io('http://' + os.hostname() + ':3000/chat', {
  //   extraHeaders: {
  //     "Authorization": config.userToken,
  //     "user_id": config.userId
  // },
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
  socket.on('connect_error', (err) => {
    console.log(`connect_error due to ${err.message}`)
  })
  store.subscribe((mutation: any) => {
    if (mutation.type == 'chat/pushChannel') {
      console.log('Registered a mutation')
      console.log(mutation)
      socket.emit('chat', 'Fils de pute', (rep: any) => {
        console.log('Got a response : ' + rep)
      })
    }
  })
}

export default createWebSocketPlugin
