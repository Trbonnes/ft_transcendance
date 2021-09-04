<template>
  <div
    class="hero min-h-screen bg-center"
    style="
      background-image: url('https://images.unsplash.com/photo-1511067007398-7e4b90cfa4bc?ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8cGluZyUyMHBvbmclMjB0YWJsZXxlbnwwfHwwfHw%3D&ixlib=rb-1.2.1&w=1000&q=80');
    "
  >
    <div class="hero-overlay bg-opacity-65"></div>
    <div class="text-center hero-content text-neutral-content">
      <div class="max-w-md">
        <h1 class="mb-5 text-5xl font-bold">Ft_Transcendance Pong Game</h1>
        <p class="mb-5">
          Accept the Ft_Transcendance Challenge and Become the Best Pong Player!
        </p>
        <NuxtLink to="/game" class="btn btn-primary">Join a Game</NuxtLink>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { createWebSocketPlugin } from '../store/plugins/websocket'

export default Vue.extend({
  middleware: 'auth',
  mounted() {
    createWebSocketPlugin(this.$store, this.$auth.strategy.token.get()) // TODO make more easy solution
  },
  methods: {
    async userLogout() {
      try {
        let response = await this.$auth.logout()
        this.$router.push('/login')
      } catch (err) {
        this.$toast.error('Logging out failed')
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
