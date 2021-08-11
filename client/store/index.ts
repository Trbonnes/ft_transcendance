import Vue from 'vue'
import Vuex from 'vuex'
import createWebSocket from '~/store/plugins/websocket'
import chat from '~/store/chat'

Vue.use(Vuex)

const store = () =>
  new Vuex.Store({
    // apparently the fact that it returns a function is super duper important
    //plugins: [createWebSocket], // plugin for websocket interaction when mutations
    // modules: {
    //   chat,
    // },

    getters: {
      isLoggedIn: (state: any) => {
        return state.auth.loggedIn
      },

      loggedInUser: (state: any) => {
        return state.auth.user
      },

      userToken: (state: any) => {
        return state.$auth.strategy.token.get()
      },
    },

    actions: {
      loadChat() {
        this.registerModule('chat', chat)
      },
    },
  })

export default store
