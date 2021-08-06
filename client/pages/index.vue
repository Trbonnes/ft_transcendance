<template>
  <div>
    <h1>You are signed in!!</h1>
    <button @click="userLogout">log out</button>
    <button @click="consoleLogUser">getUser</button>
    <SideMenu id="side"></SideMenu>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { createWebSocketPlugin } from '../store/plugins/websocket'

export default Vue.extend({
  middleware: 'auth',
  mounted() {
    createWebSocketPlugin(this.$store, this.$auth.strategy.token.get())
  },
  methods: {
    async userLogout() {
      try {
        let response = await this.$auth.logout()
        this.$router.replace('/login')
      } catch (err) {
        console.log(err)
      }
    },

    async consoleLogUser() {
      console.log(this.$auth.user)
    },
  },
})
</script>

<style>
#side {
  position: fixed;
  width: 30vw;
  right: 0;
  top: 0;
  height: 100vh;
}
</style>
