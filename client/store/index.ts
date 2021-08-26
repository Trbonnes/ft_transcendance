import Vue from 'vue'
import Vuex from 'vuex'
import { createWebSocketPlugin } from '~/store/plugins/websocket'
import chat from '~/store/chat'
import channel from '~/store/channel'

Vue.use(Vuex)

const store = () =>
  new Vuex.Store({
    // apparently the fact that it returns a function is super duper important
    plugins: [createWebSocketPlugin], // plugin for websocket interaction when mutations
    modules: {
      channel,
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
        this.registerModule('chat', chat)
      },
    },
  })

export default store
