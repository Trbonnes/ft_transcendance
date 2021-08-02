<template>
  <div class="container">
    <div>
      <h1 class="title">transcendence game</h1>
      <div class="links">
        <NuxtLink to="/game" class="button--green"> Game</NuxtLink>
        <div class="flex flex-col p-5">
          <input v-model="message" type="text" class="w-40 shadow-xl" />
          <span>Going to connect as {{ message }}</span>
          <button class="block w-40" @click="submitName">Connect</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import createWebSocketPlugin from '~/store/plugins/websocket'
export default Vue.extend({
  data() {
    return {
      message: 'john@doe',
    }
  },
  methods: {
    submitName() {
      console.log('Submitting name : ' + this.message)
      console.log('ok boomer')
      createWebSocketPlugin(this.$store)
    },
  },
})
</script>

<style></style>
