import Vue from 'vue'
import Vuex from 'vuex'
import createWebSocket from '~/store/plugins/websocket'
import chat from '~/store/chat'
import channel from '~/store/channel'

Vue.use(Vuex)

const store = () =>
  new Vuex.Store({
    // apparently the fact that it returns a function is super duper important
    //plugins: [createWebSocket], // plugin for websocket interaction when mutations
    modules: {
      channel,
    },
    actions: {
      loadChat() {
        this.registerModule('chat', chat)
      },
    },
  })

export default store
