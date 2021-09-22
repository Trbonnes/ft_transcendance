import { getSocket, createWebSocketPlugin } from '~/store/plugins/websocket'

export default function(nuxt: any) {
  console.log("OSCOUUUUUUUUUUUUUUUUUUUUUUUR")
  let socket = getSocket()
  if (nuxt.$auth.loggedIn && socket.connected === false) {
    socket.io.opts.extraHeaders = { Authorization: nuxt.$auth.strategy.token.get() }
    socket.connect()
  }
  if (!nuxt.$auth.loggedIn && socket.connected === true) {
    socket.io.opts.extraHeaders = {}
    socket.disconnect()
  }
}

