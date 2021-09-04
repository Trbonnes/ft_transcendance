import Vue from 'vue'
import Vuex from 'vuex'
import { Plugin } from 'vuex'
import { createWebSocketPlugin } from '~/store/plugins/websocket'
import channel from '~/store/channel'

Vue.use(Vuex)

const store = () =>
  new Vuex.Store({
    // apparently the fact that it returns a function is super duper important
    plugins: [createWebSocketPlugin as Plugin<any>], // plugin for websocket interaction when mutations
    modules: {
      channel, // TODO only launch when logged in maybe ?
    },
    getters: {
      isLoggedIn: (state: any) => {
        return state.auth.loggedIn
      },

      loggedInUser: (state: any) => {
        return state.auth.user
      },
    },
    actions: {
      loadChat() {
        this.registerModule('channel', channel)
      },
    },
  })

export default store
